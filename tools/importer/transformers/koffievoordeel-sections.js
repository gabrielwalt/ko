/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: koffievoordeel sections.
 * Adds section breaks (<hr>) between sections based on template configuration.
 * Runs in afterTransform only, uses payload.template.sections.
 *
 * Uses a multi-strategy approach to find section anchors:
 *   1. Block tables (by header text) — works after parsers replace DOM elements
 *   2. Original section selector — works when DOM structure is preserved
 *   3. Default content selectors — fallback for content-only sections
 */

function findSectionElement(root, selector) {
  if (!selector) return null;
  if (Array.isArray(selector)) {
    for (const sel of selector) {
      try {
        const found = root.querySelector(sel);
        if (found) return found;
      } catch (e) { /* invalid selector */ }
    }
    return null;
  }
  try {
    return root.querySelector(selector);
  } catch (e) {
    return null;
  }
}

/**
 * Create a block table, using WebImporter when available, with manual fallback.
 */
function createBlock(doc, name, cells) {
  if (typeof WebImporter !== 'undefined' && WebImporter.Blocks) {
    return WebImporter.Blocks.createBlock(doc, { name, cells });
  }
  // Manual fallback
  const table = doc.createElement('table');
  const headerRow = doc.createElement('tr');
  const headerCell = doc.createElement('th');
  headerCell.colSpan = 100;
  headerCell.textContent = name;
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);
  if (cells && typeof cells === 'object' && !Array.isArray(cells)) {
    Object.entries(cells).forEach(([key, value]) => {
      const tr = doc.createElement('tr');
      const tdKey = doc.createElement('td');
      tdKey.textContent = key;
      tr.appendChild(tdKey);
      const tdVal = doc.createElement('td');
      tdVal.textContent = value;
      tr.appendChild(tdVal);
      table.appendChild(tr);
    });
  }
  return table;
}

/**
 * Normalize a block name for comparison: lowercase, hyphens → spaces, collapse whitespace.
 * Handles both kebab-case ("cards-category") and title case ("Cards Category").
 */
function normalizeBlockName(name) {
  return name.trim().toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ');
}

/**
 * Find a block table by its header text.
 * Parsers create <table> elements where the first row header contains the block name.
 * WebImporter.Blocks.createBlock converts "cards-category" → "Cards Category" in the header,
 * so we normalize both sides for comparison.
 */
function findBlockTable(root, blockName) {
  const normalName = normalizeBlockName(blockName);
  const tables = root.querySelectorAll('table');
  for (const table of tables) {
    const header = table.querySelector('tr:first-child th, tr:first-child td');
    if (header) {
      const headerText = normalizeBlockName(header.textContent);
      if (headerText === normalName) return table;
    }
  }
  return null;
}

/**
 * Find the anchor (first element) of a section using multiple strategies.
 */
function findSectionAnchor(root, section) {
  // Strategy 1: Find a heading by partial text match (headingMatch property)
  // Checked first because sections usually start with their heading, not the block table.
  if (section.headingMatch) {
    const needle = section.headingMatch.toLowerCase();
    const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (const h of headings) {
      if (h.textContent.toLowerCase().includes(needle)) return h;
    }
  }

  // Strategy 2: Find the first block's table
  if (section.blocks && section.blocks.length > 0) {
    for (const blockName of section.blocks) {
      const table = findBlockTable(root, blockName);
      if (table) return table;
    }
  }

  // Strategy 3: Original section selector
  const el = findSectionElement(root, section.selector);
  if (el) return el;

  // Strategy 4: Default content selectors
  if (section.defaultContent) {
    for (const sel of section.defaultContent) {
      const found = findSectionElement(root, sel);
      if (found) return found;
    }
  }

  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const template = payload && payload.template;
  if (!template || !template.sections || template.sections.length < 2) return;

  const doc = element.ownerDocument || document;
  const sections = template.sections;

  // Collect all anchors first
  const anchors = sections.map((s) => findSectionAnchor(element, s));

  // Process forward: for each section boundary, insert hr + optional section-metadata
  for (let i = 1; i < sections.length; i++) {
    if (!anchors[i]) continue;

    // If previous section has a style, add section-metadata before this anchor
    // (placing it at the end of the previous section)
    if (sections[i - 1].style) {
      const metaBlock = createBlock(doc, 'Section Metadata', { style: sections[i - 1].style });
      anchors[i].before(metaBlock);
    }

    // Insert <hr> section break before this section's anchor
    const hr = doc.createElement('hr');
    anchors[i].before(hr);
  }

  // Handle last section's style (section-metadata at the end of the document)
  const lastIdx = sections.length - 1;
  if (sections[lastIdx].style) {
    const metaBlock = createBlock(doc, 'Section Metadata', { style: sections[lastIdx].style });
    element.appendChild(metaBlock);
  }
}
