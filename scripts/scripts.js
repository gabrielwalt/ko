import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to?.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Read a tabTitle value from a section-metadata block inside a section div.
 * Returns the title string or null if none found.
 */
function getTabTitle(section) {
  const meta = section.querySelector('.section-metadata');
  if (!meta) return null;
  const rows = [...meta.children];
  for (let r = 0; r < rows.length; r += 1) {
    const cells = [...rows[r].children];
    if (cells.length >= 2
      && cells[0].textContent.trim().toLowerCase() === 'tabtitle') {
      return cells[1].textContent.trim();
    }
  }
  return null;
}

/**
 * Detect consecutive sections with tabTitle metadata and combine them
 * into a single tabs block inside the preceding section.
 * @param {Element} main The container element
 */
function buildTabsAutoBlock(main) {
  const sections = [...main.children];
  let i = 0;
  while (i < sections.length) {
    if (!getTabTitle(sections[i])) {
      i += 1;
    } else {
      // Collect consecutive tab sections
      const group = [];
      while (i < sections.length && getTabTitle(sections[i])) {
        group.push({ title: getTabTitle(sections[i]), el: sections[i] });
        i += 1;
      }

      if (group.length >= 2) {
        // Build tabs block: each child row = [label | content]
        const block = document.createElement('div');
        group.forEach(({ title, el }) => {
          const row = document.createElement('div');
          const labelDiv = document.createElement('div');
          labelDiv.textContent = title;
          row.append(labelDiv);
          const contentDiv = document.createElement('div');
          [...el.children].forEach((child) => {
            if (!child.classList.contains('section-metadata')) {
              contentDiv.append(child);
            }
          });
          row.append(contentDiv);
          block.append(row);
        });
        block.classList.add('tabs');

        // Merge tabs block into the preceding section
        const prev = group[0].el.previousElementSibling;
        if (prev) {
          prev.append(block);
        }

        // Remove the consumed tab-section divs
        group.forEach(({ el }) => el.remove());
      }
    }
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildTabsAutoBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
