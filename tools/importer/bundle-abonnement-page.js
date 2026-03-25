// tools/importer/parsers/hero-subscription.js
function createBlockHelper(doc, { name, cells }) {
  if (typeof WebImporter !== "undefined" && WebImporter.Blocks) {
    return WebImporter.Blocks.createBlock(doc, { name, cells });
  }
  const table = doc.createElement("table");
  const headerRow = doc.createElement("tr");
  const headerCell = doc.createElement("td");
  headerCell.colSpan = 100;
  headerCell.textContent = name;
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);
  cells.forEach((row) => {
    const tr = doc.createElement("tr");
    const rowArr = Array.isArray(row) ? row : [row];
    rowArr.forEach((cell) => {
      const td = doc.createElement("td");
      if (cell instanceof Node) {
        td.appendChild(cell);
      } else if (typeof cell === "string") {
        td.textContent = cell;
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  return table;
}
function parse(element, { document: document2 }) {
  const heroContainer = element.closest(".pagebuilder-column-line") || element.parentElement;
  const figure = heroContainer ? heroContainer.querySelector("figure") : null;
  const bgImage = figure ? figure.querySelector("img") : null;
  if (figure && figure.parentElement) figure.remove();
  const heading = element.querySelector(".desktop h1") || element.querySelector("h1");
  const subtitle = element.querySelector(".desktop p em") || element.querySelector("p em");
  const benefitParagraphs = element.querySelectorAll(":scope > div:not(.desktop):not(.mobile) > p");
  const ctaLink = element.querySelector("a.pagebuilder-button-primary");
  const imageFrag = document2.createDocumentFragment();
  if (bgImage) {
    imageFrag.appendChild(document2.createComment(" field:image "));
    const img = document2.createElement("img");
    img.src = bgImage.src;
    img.alt = bgImage.alt || "";
    imageFrag.appendChild(img);
  }
  const textFrag = document2.createDocumentFragment();
  textFrag.appendChild(document2.createComment(" field:text "));
  if (heading) {
    const h1 = document2.createElement("h1");
    h1.textContent = heading.textContent.trim();
    textFrag.appendChild(h1);
  }
  if (subtitle) {
    const p = document2.createElement("p");
    const em = document2.createElement("em");
    const strong = document2.createElement("strong");
    strong.textContent = subtitle.textContent.trim();
    em.appendChild(strong);
    p.appendChild(em);
    textFrag.appendChild(p);
  }
  benefitParagraphs.forEach((para) => {
    const p = document2.createElement("p");
    p.innerHTML = para.innerHTML;
    textFrag.appendChild(p);
  });
  if (ctaLink) {
    const p = document2.createElement("p");
    const a = document2.createElement("a");
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim();
    p.appendChild(a);
    textFrag.appendChild(p);
  }
  const cells = [];
  if (bgImage) {
    cells.push([imageFrag]);
  }
  cells.push([textFrag]);
  const block = createBlockHelper(document2, { name: "hero-subscription", cells });
  element.replaceWith(block);
}

// tools/importer/parsers/cards-steps.js
function createBlockHelper2(doc, { name, cells }) {
  if (typeof WebImporter !== "undefined" && WebImporter.Blocks) {
    return WebImporter.Blocks.createBlock(doc, { name, cells });
  }
  const table = doc.createElement("table");
  const headerRow = doc.createElement("tr");
  const headerCell = doc.createElement("td");
  headerCell.colSpan = 100;
  headerCell.textContent = name;
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);
  cells.forEach((row) => {
    const tr = doc.createElement("tr");
    const rowArr = Array.isArray(row) ? row : [row];
    rowArr.forEach((cell) => {
      const td = doc.createElement("td");
      if (cell instanceof Node) {
        td.appendChild(cell);
      } else if (typeof cell === "string") {
        td.textContent = cell;
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  return table;
}
function parse2(element, { document: document2 }) {
  if (!element.parentElement) return;
  const steps = element.querySelectorAll(".kv-step");
  const cells = [];
  steps.forEach((step) => {
    const iconImg = step.querySelector(".kv-step-icon img");
    const stepText = step.querySelector(".kv-step-text");
    const stepNumber = step.querySelector(".kv-step-number");
    const imageFrag = document2.createDocumentFragment();
    imageFrag.appendChild(document2.createComment(" field:image "));
    if (iconImg) {
      const img = document2.createElement("img");
      img.src = iconImg.src;
      img.alt = iconImg.alt || "";
      imageFrag.appendChild(img);
    }
    const textFrag = document2.createDocumentFragment();
    textFrag.appendChild(document2.createComment(" field:text "));
    const p = document2.createElement("p");
    const parts = [];
    if (stepNumber) parts.push(stepNumber.textContent.trim());
    if (stepText) parts.push(stepText.textContent.trim());
    p.textContent = parts.join(" ");
    textFrag.appendChild(p);
    cells.push([imageFrag, textFrag]);
  });
  if (cells.length === 0) return;
  const block = createBlockHelper2(document2, { name: "cards-steps", cells });
  element.replaceWith(block);
}

// tools/importer/parsers/cards-category.js
function createBlockHelper3(doc, { name, cells }) {
  if (typeof WebImporter !== "undefined" && WebImporter.Blocks) {
    return WebImporter.Blocks.createBlock(doc, { name, cells });
  }
  const table = doc.createElement("table");
  const headerRow = doc.createElement("tr");
  const headerCell = doc.createElement("td");
  headerCell.colSpan = 100;
  headerCell.textContent = name;
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);
  cells.forEach((row) => {
    const tr = doc.createElement("tr");
    const rowArr = Array.isArray(row) ? row : [row];
    rowArr.forEach((cell) => {
      const td = doc.createElement("td");
      if (cell instanceof Node) {
        td.appendChild(cell);
      } else if (typeof cell === "string") {
        td.textContent = cell;
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  return table;
}
function parse3(element, { document: document2 }) {
  if (!element.parentElement) return;
  const columnLine = element.closest(".pagebuilder-column-line") || element.parentElement;
  if (!columnLine) return;
  const columns = [...columnLine.querySelectorAll(".pagebuilder-column")];
  const cells = [];
  columns.forEach((col) => {
    const figure = col.querySelector("figure");
    if (!figure) return;
    const img = figure.querySelector("img");
    const iconText = col.querySelector(".icon-button-text");
    let linkEl = null;
    let linkText = "";
    if (iconText) {
      const wrapper = iconText.parentElement;
      linkEl = wrapper ? wrapper.querySelector("a[href]") : null;
      if (!linkEl) {
        const allLinks = [...col.querySelectorAll("a[href]")];
        linkEl = allLinks.find((l) => !figure.contains(l)) || allLinks[0];
      }
      linkText = iconText.textContent.trim();
    } else {
      const allLinks = [...col.querySelectorAll("a[href]")];
      linkEl = allLinks.find((l) => !figure.contains(l)) || allLinks[0];
      if (linkEl) linkText = linkEl.textContent.trim();
    }
    const imageFrag = document2.createDocumentFragment();
    imageFrag.appendChild(document2.createComment(" field:image "));
    if (img) {
      const newImg = document2.createElement("img");
      newImg.src = img.src;
      newImg.alt = img.alt || "";
      imageFrag.appendChild(newImg);
    }
    const textFrag = document2.createDocumentFragment();
    textFrag.appendChild(document2.createComment(" field:text "));
    if (linkEl && linkText) {
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.href = linkEl.href;
      a.textContent = linkText;
      p.appendChild(a);
      textFrag.appendChild(p);
    }
    cells.push([imageFrag, textFrag]);
  });
  if (cells.length === 0) return;
  const block = createBlockHelper3(document2, { name: "cards-category", cells });
  columns.forEach((col) => {
    if (col !== element && col.parentElement) col.remove();
  });
  element.replaceWith(block);
}

// tools/importer/parsers/cards-category-brands.js
function createBlockHelper4(doc, { name, cells }) {
  if (typeof WebImporter !== "undefined" && WebImporter.Blocks) {
    return WebImporter.Blocks.createBlock(doc, { name, cells });
  }
  const table = doc.createElement("table");
  const headerRow = doc.createElement("tr");
  const headerCell = doc.createElement("td");
  headerCell.colSpan = 100;
  headerCell.textContent = name;
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);
  cells.forEach((row) => {
    const tr = doc.createElement("tr");
    const rowArr = Array.isArray(row) ? row : [row];
    rowArr.forEach((cell) => {
      const td = doc.createElement("td");
      if (cell instanceof Node) {
        td.appendChild(cell);
      } else if (typeof cell === "string") {
        td.textContent = cell;
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  return table;
}
function parse4(element, { document: document2 }) {
  if (!element.parentElement) return;
  const columnLine = element.closest(".pagebuilder-column-line") || element.parentElement;
  if (!columnLine) return;
  const columns = [...columnLine.querySelectorAll(".pagebuilder-column")];
  const cells = [];
  columns.forEach((col) => {
    const figure = col.querySelector("figure");
    if (!figure) return;
    const img = figure.querySelector("img");
    if (!img) return;
    const imageFrag = document2.createDocumentFragment();
    imageFrag.appendChild(document2.createComment(" field:image "));
    const newImg = document2.createElement("img");
    newImg.src = img.src;
    newImg.alt = img.alt || "";
    imageFrag.appendChild(newImg);
    const textFrag = document2.createDocumentFragment();
    textFrag.appendChild(document2.createComment(" field:text "));
    const p = document2.createElement("p");
    p.textContent = "brand";
    textFrag.appendChild(p);
    cells.push([imageFrag, textFrag]);
  });
  if (cells.length === 0) return;
  const block = createBlockHelper4(document2, { name: "cards-category (brands)", cells });
  columns.forEach((col) => {
    if (col !== element && col.parentElement) col.remove();
  });
  element.replaceWith(block);
}

// tools/importer/parsers/banner.js
function createBlockHelper5(doc, { name, cells }) {
  if (typeof WebImporter !== "undefined" && WebImporter.Blocks) {
    return WebImporter.Blocks.createBlock(doc, { name, cells });
  }
  const table = doc.createElement("table");
  const headerRow = doc.createElement("tr");
  const headerCell = doc.createElement("td");
  headerCell.colSpan = 100;
  headerCell.textContent = name;
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);
  cells.forEach((row) => {
    const tr = doc.createElement("tr");
    const rowArr = Array.isArray(row) ? row : [row];
    rowArr.forEach((cell) => {
      const td = doc.createElement("td");
      if (cell instanceof Node) {
        td.appendChild(cell);
      } else if (typeof cell === "string") {
        td.textContent = cell;
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  return table;
}
function parse5(element, { document: document2 }) {
  if (!element.parentElement) return;
  const figure = element.closest("figure") || element.parentElement;
  let desktopImg = null;
  let mobileImg = null;
  const allImgs = figure.querySelectorAll("img");
  allImgs.forEach((img) => {
    const src = img.src || img.getAttribute("data-src") || "";
    if (src.includes("desk")) desktopImg = img;
    else if (src.includes("mob")) mobileImg = img;
  });
  if (!desktopImg) desktopImg = element;
  const cells = [];
  if (desktopImg) {
    const frag = document2.createDocumentFragment();
    frag.appendChild(document2.createComment(" field:imageDesktop "));
    const img = document2.createElement("img");
    img.src = desktopImg.src || desktopImg.getAttribute("data-src") || "";
    img.alt = desktopImg.alt || "";
    frag.appendChild(img);
    cells.push([frag]);
  }
  if (mobileImg) {
    const frag = document2.createDocumentFragment();
    frag.appendChild(document2.createComment(" field:imageMobile "));
    const img = document2.createElement("img");
    img.src = mobileImg.src || mobileImg.getAttribute("data-src") || "";
    img.alt = mobileImg.alt || "";
    frag.appendChild(img);
    cells.push([frag]);
  }
  if (cells.length === 0) return;
  const block = createBlockHelper5(document2, { name: "banner", cells });
  const replaceTarget = figure.parentElement && figure.parentElement.children.length === 1 ? figure.parentElement : figure;
  replaceTarget.replaceWith(block);
}

// tools/importer/parsers/tabs.js
function createBlockHelper6(doc, { name, cells }) {
  if (typeof WebImporter !== "undefined" && WebImporter.Blocks) {
    return WebImporter.Blocks.createBlock(doc, { name, cells });
  }
  const table = doc.createElement("table");
  const headerRow = doc.createElement("tr");
  const headerCell = doc.createElement("td");
  headerCell.colSpan = 100;
  headerCell.textContent = name;
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);
  cells.forEach((row) => {
    const tr = doc.createElement("tr");
    const rowArr = Array.isArray(row) ? row : [row];
    rowArr.forEach((cell) => {
      const td = doc.createElement("td");
      if (cell instanceof Node) {
        td.appendChild(cell);
      } else if (typeof cell === "string") {
        td.textContent = cell;
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  return table;
}
function extractProductContent(product, document2) {
  const frag = document2.createDocumentFragment();
  const productImg = product.querySelector(".product-image-photo.photo");
  const nameLink = product.querySelector(".product-item-link");
  const strengthLabel = product.querySelector(".strength-label");
  const description = product.querySelector(".product-item-description");
  const specialPrice = product.querySelector(".special-price .price");
  const oldPrice = product.querySelector(".old-price .price");
  const ctaLink = product.querySelector(".actions-primary a");
  if (productImg && !/placeholder/i.test(productImg.src)) {
    const p = document2.createElement("p");
    const img = document2.createElement("img");
    img.src = productImg.src;
    img.alt = productImg.alt || "";
    p.appendChild(img);
    frag.appendChild(p);
  }
  if (nameLink) {
    const h3 = document2.createElement("h3");
    const a = document2.createElement("a");
    a.href = nameLink.href;
    a.textContent = nameLink.textContent.trim();
    h3.appendChild(a);
    frag.appendChild(h3);
  }
  if (strengthLabel) {
    const p = document2.createElement("p");
    const strong = document2.createElement("strong");
    strong.textContent = "Intensiteit " + strengthLabel.textContent.trim() + "/12";
    p.appendChild(strong);
    frag.appendChild(p);
  }
  if (description) {
    const p = document2.createElement("p");
    p.textContent = description.textContent.trim().replace(/\s+/g, " ");
    frag.appendChild(p);
  }
  if (specialPrice) {
    const p = document2.createElement("p");
    if (oldPrice) {
      const del = document2.createElement("del");
      del.textContent = oldPrice.textContent.trim().replace(/\s+/g, "");
      p.appendChild(del);
      p.appendChild(document2.createTextNode(" "));
    }
    const strong = document2.createElement("strong");
    strong.textContent = specialPrice.textContent.trim().replace(/\s+/g, "");
    p.appendChild(strong);
    frag.appendChild(p);
  }
  if (ctaLink) {
    const p = document2.createElement("p");
    const a = document2.createElement("a");
    a.href = ctaLink.href;
    a.textContent = ctaLink.textContent.trim();
    p.appendChild(a);
    frag.appendChild(p);
  }
  return frag;
}
function parse6(element, { document: document2 }) {
  if (!element.parentElement) return;
  const tabPanels = element.querySelectorAll('[role="tabpanel"]');
  const tabHeaders = element.querySelectorAll('[role="tab"]');
  const cells = [];
  tabPanels.forEach((panel, i) => {
    const tabHeader = tabHeaders[i];
    const label = panel.getAttribute("data-tab-name") || (tabHeader ? tabHeader.textContent.trim() : `Tab ${i + 1}`);
    const labelFrag = document2.createDocumentFragment();
    labelFrag.appendChild(document2.createComment(" field:label "));
    labelFrag.appendChild(document2.createTextNode(label));
    const contentFrag = document2.createDocumentFragment();
    contentFrag.appendChild(document2.createComment(" field:content "));
    const viewAllLink = panel.querySelector(".tab-link a");
    if (viewAllLink) {
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.href = viewAllLink.href;
      a.textContent = viewAllLink.textContent.trim();
      p.appendChild(a);
      contentFrag.appendChild(p);
    }
    const products = panel.querySelectorAll(".product-item");
    products.forEach((product) => {
      contentFrag.appendChild(extractProductContent(product, document2));
    });
    cells.push([labelFrag, contentFrag]);
  });
  if (cells.length === 0) return;
  const block = createBlockHelper6(document2, { name: "tabs", cells });
  element.replaceWith(block);
}

// tools/importer/parsers/cards-product.js
function createBlockHelper7(doc, { name, cells }) {
  if (typeof WebImporter !== "undefined" && WebImporter.Blocks) {
    return WebImporter.Blocks.createBlock(doc, { name, cells });
  }
  const table = doc.createElement("table");
  const headerRow = doc.createElement("tr");
  const headerCell = doc.createElement("td");
  headerCell.colSpan = 100;
  headerCell.textContent = name;
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);
  cells.forEach((row) => {
    const tr = doc.createElement("tr");
    const rowArr = Array.isArray(row) ? row : [row];
    rowArr.forEach((cell) => {
      const td = doc.createElement("td");
      if (cell instanceof Node) {
        td.appendChild(cell);
      } else if (typeof cell === "string") {
        td.textContent = cell;
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  return table;
}
function parse7(element, { document: document2 }) {
  if (!element.parentElement) return;
  const products = element.querySelectorAll(".product-item");
  const cells = [];
  products.forEach((product) => {
    const photoLink = product.querySelector(".product-item-photo");
    const productImg = product.querySelector(".product-image-photo.photo");
    const nameLink = product.querySelector(".product-item-link");
    const strengthLabel = product.querySelector(".strength-label");
    const description = product.querySelector(".product-item-description");
    const specialPrice = product.querySelector(".special-price .price");
    const oldPrice = product.querySelector(".old-price .price");
    const ctaLink = product.querySelector(".actions-primary a");
    const imageFrag = document2.createDocumentFragment();
    imageFrag.appendChild(document2.createComment(" field:image "));
    if (productImg) {
      const img = document2.createElement("img");
      img.src = productImg.src;
      img.alt = productImg.alt || "";
      imageFrag.appendChild(img);
    }
    const textFrag = document2.createDocumentFragment();
    textFrag.appendChild(document2.createComment(" field:text "));
    if (nameLink) {
      const h3 = document2.createElement("h3");
      const a = document2.createElement("a");
      a.href = nameLink.href;
      a.textContent = nameLink.textContent.trim();
      h3.appendChild(a);
      textFrag.appendChild(h3);
    }
    if (strengthLabel) {
      const p = document2.createElement("p");
      const strong = document2.createElement("strong");
      strong.textContent = "Intensiteit " + strengthLabel.textContent.trim() + "/12";
      p.appendChild(strong);
      textFrag.appendChild(p);
    }
    if (description) {
      const p = document2.createElement("p");
      p.textContent = description.textContent.trim().replace(/\s+/g, " ");
      textFrag.appendChild(p);
    }
    if (specialPrice) {
      const p = document2.createElement("p");
      const priceText = specialPrice.textContent.trim().replace(/\s+/g, "");
      if (oldPrice) {
        const del = document2.createElement("del");
        del.textContent = oldPrice.textContent.trim().replace(/\s+/g, "");
        p.appendChild(del);
        p.appendChild(document2.createTextNode(" "));
      }
      const strong = document2.createElement("strong");
      strong.textContent = priceText;
      p.appendChild(strong);
      textFrag.appendChild(p);
    }
    if (ctaLink) {
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      p.appendChild(a);
      textFrag.appendChild(p);
    }
    cells.push([imageFrag, textFrag]);
  });
  if (cells.length === 0) return;
  const block = createBlockHelper7(document2, { name: "cards-product", cells });
  element.replaceWith(block);
}

// tools/importer/parsers/accordion-faq.js
function createBlockHelper8(doc, { name, cells }) {
  if (typeof WebImporter !== "undefined" && WebImporter.Blocks) {
    return WebImporter.Blocks.createBlock(doc, { name, cells });
  }
  const table = doc.createElement("table");
  const headerRow = doc.createElement("tr");
  const headerCell = doc.createElement("td");
  headerCell.colSpan = 100;
  headerCell.textContent = name;
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);
  cells.forEach((row) => {
    const tr = doc.createElement("tr");
    const rowArr = Array.isArray(row) ? row : [row];
    rowArr.forEach((cell) => {
      const td = doc.createElement("td");
      if (cell instanceof Node) {
        td.appendChild(cell);
      } else if (typeof cell === "string") {
        td.textContent = cell;
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  return table;
}
function parse8(element, { document: document2 }) {
  if (!element.parentElement) return;
  const faqContainer = element.parentElement;
  const allItems = faqContainer.querySelectorAll('[data-collapsible="true"]');
  const cells = [];
  allItems.forEach((item) => {
    const tab = item.querySelector('[role="tab"]');
    const tabpanel = item.querySelector('[role="tabpanel"]');
    const contentDiv = tabpanel ? tabpanel.querySelector(".content") || tabpanel : null;
    const summaryFrag = document2.createDocumentFragment();
    summaryFrag.appendChild(document2.createComment(" field:summary "));
    if (tab) {
      summaryFrag.appendChild(document2.createTextNode(tab.textContent.trim()));
    }
    const textFrag = document2.createDocumentFragment();
    textFrag.appendChild(document2.createComment(" field:text "));
    if (contentDiv) {
      const paragraphs = contentDiv.querySelectorAll("p");
      paragraphs.forEach((para) => {
        const p = document2.createElement("p");
        p.innerHTML = para.innerHTML;
        textFrag.appendChild(p);
      });
    }
    cells.push([summaryFrag, textFrag]);
  });
  if (cells.length === 0) return;
  const block = createBlockHelper8(document2, { name: "accordion-faq", cells });
  faqContainer.replaceWith(block);
}

// tools/importer/transformers/koffievoordeel-cleanup.js
var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
function removeSelectors(el, selectors) {
  if (typeof WebImporter !== "undefined" && WebImporter.DOMUtils) {
    WebImporter.DOMUtils.remove(el, selectors);
  } else {
    selectors.forEach((sel) => {
      el.querySelectorAll(sel).forEach((node) => node.remove());
    });
  }
}
function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    removeSelectors(element, [
      "#cookie_consent_dialog",
      "#cookie-status",
      ".cookie-consent-dialog"
    ]);
    removeSelectors(element, [".breadcrumbs"]);
    element.querySelectorAll("blockquote").forEach((bq) => {
      const doc = element.ownerDocument || document;
      const div = doc.createElement("div");
      while (bq.firstChild) div.appendChild(bq.firstChild);
      bq.replaceWith(div);
    });
    const mainColBefore = element.querySelector(".column.main");
    if (mainColBefore) {
      [...mainColBefore.children].forEach((child) => {
        const fc = child.firstElementChild;
        if (fc && fc.classList.contains("desktop")) {
          const hasBrandLogos = child.querySelector('[class*="brand-abo"], [class*="brand-starbucks"]');
          if (!hasBrandLogos) {
            child.remove();
          }
        }
      });
    }
    element.querySelectorAll(".kv-steps-slider").forEach((slider) => {
      let rowInner = slider.parentElement;
      while (rowInner && !rowInner.classList.contains("row-full-width-inner")) {
        rowInner = rowInner.parentElement;
      }
      if (!rowInner) return;
      [...rowInner.querySelectorAll(".pagebuilder-column-group")].forEach((group) => {
        if (group.querySelector(".kv-steps-slider")) return;
        if (group.querySelector("h1, h2, h3")) return;
        group.remove();
      });
    });
    removeSelectors(element, ["#amhideprice-form", "form.amhideprice-form"]);
  }
  if (hookName === TransformHook.afterTransform) {
    removeSelectors(element, [
      // Header/footer
      "header.page-header",
      "footer.page-footer",
      // Search
      "form.minisearch",
      "#search_autocomplete",
      "#search_autocomplete_mobile",
      "#search_autocomplete_sticky",
      // Non-content elements
      "#coupon-message-block",
      "noscript",
      "iframe",
      "link",
      // Hidden empty anchor (hero-quote source)
      "#favoriete-koffie",
      // Coffee Finder floating button
      ".ribbon-button",
      // Tracking pixels
      'img[src*="bat.bing.com"]'
    ]);
    const mainCol = element.querySelector(".column.main");
    if (mainCol) {
      [...mainCol.children].forEach((child) => {
        const tag = child.tagName;
        if (tag === "STYLE" || tag === "INPUT") {
          child.remove();
          return;
        }
        if (tag === "DIV" || tag === "FORM") {
          const kids = [...child.children];
          const onlyStyles = kids.length > 0 && kids.every((c) => c.tagName === "STYLE");
          const isEmpty = kids.length === 0 && child.textContent.trim() === "";
          if (onlyStyles || isEmpty) {
            child.remove();
          }
        }
      });
      let faqTable = null;
      mainCol.querySelectorAll("table").forEach((t) => {
        const header = t.querySelector("tr:first-child th") || t.querySelector("tr:first-child td");
        if (header && header.textContent.trim() === "accordion-faq") {
          faqTable = t;
        }
      });
      if (faqTable) {
        let next = faqTable.nextElementSibling;
        while (next) {
          const toRemove = next;
          next = next.nextElementSibling;
          toRemove.remove();
        }
        let containerDiv = faqTable.parentElement;
        while (containerDiv && containerDiv.parentElement !== mainCol) {
          containerDiv = containerDiv.parentElement;
        }
        if (containerDiv) {
          let parentNext = containerDiv.nextElementSibling;
          while (parentNext) {
            const toRemove = parentNext;
            parentNext = parentNext.nextElementSibling;
            toRemove.remove();
          }
        }
      }
    }
    element.querySelectorAll("*").forEach((el) => {
      el.removeAttribute("onclick");
      el.removeAttribute("data-track");
      el.removeAttribute("data-container");
    });
  }
}

// tools/importer/transformers/koffievoordeel-sections.js
function findSectionElement(root, selector) {
  if (!selector) return null;
  if (Array.isArray(selector)) {
    for (const sel of selector) {
      try {
        const found = root.querySelector(sel);
        if (found) return found;
      } catch (e) {
      }
    }
    return null;
  }
  try {
    return root.querySelector(selector);
  } catch (e) {
    return null;
  }
}
function createBlock(doc, name, cells) {
  if (typeof WebImporter !== "undefined" && WebImporter.Blocks) {
    return WebImporter.Blocks.createBlock(doc, { name, cells });
  }
  const table = doc.createElement("table");
  const headerRow = doc.createElement("tr");
  const headerCell = doc.createElement("th");
  headerCell.colSpan = 100;
  headerCell.textContent = name;
  headerRow.appendChild(headerCell);
  table.appendChild(headerRow);
  if (cells && typeof cells === "object" && !Array.isArray(cells)) {
    Object.entries(cells).forEach(([key, value]) => {
      const tr = doc.createElement("tr");
      const tdKey = doc.createElement("td");
      tdKey.textContent = key;
      tr.appendChild(tdKey);
      const tdVal = doc.createElement("td");
      tdVal.textContent = value;
      tr.appendChild(tdVal);
      table.appendChild(tr);
    });
  }
  return table;
}
function normalizeBlockName(name) {
  return name.trim().toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ");
}
function findBlockTable(root, blockName) {
  const normalName = normalizeBlockName(blockName);
  const tables = root.querySelectorAll("table");
  for (const table of tables) {
    const header = table.querySelector("tr:first-child th, tr:first-child td");
    if (header) {
      const headerText = normalizeBlockName(header.textContent);
      if (headerText === normalName) return table;
    }
  }
  return null;
}
function findSectionAnchor(root, section) {
  if (section.headingMatch) {
    const needle = section.headingMatch.toLowerCase();
    const headings = root.querySelectorAll("h1, h2, h3, h4, h5, h6");
    for (const h of headings) {
      if (h.textContent.toLowerCase().includes(needle)) return h;
    }
  }
  if (section.blocks && section.blocks.length > 0) {
    for (const blockName of section.blocks) {
      const table = findBlockTable(root, blockName);
      if (table) return table;
    }
  }
  const el = findSectionElement(root, section.selector);
  if (el) return el;
  if (section.defaultContent) {
    for (const sel of section.defaultContent) {
      const found = findSectionElement(root, sel);
      if (found) return found;
    }
  }
  return null;
}
function transform2(hookName, element, payload) {
  if (hookName !== "afterTransform") return;
  const template = payload && payload.template;
  if (!template || !template.sections || template.sections.length < 2) return;
  const doc = element.ownerDocument || document;
  const sections = template.sections;
  const anchors = sections.map((s) => findSectionAnchor(element, s));
  for (let i = 1; i < sections.length; i++) {
    if (!anchors[i]) continue;
    if (sections[i - 1].style) {
      const metaBlock = createBlock(doc, "Section Metadata", { style: sections[i - 1].style });
      anchors[i].before(metaBlock);
    }
    const hr = doc.createElement("hr");
    anchors[i].before(hr);
  }
  const lastIdx = sections.length - 1;
  if (sections[lastIdx].style) {
    const metaBlock = createBlock(doc, "Section Metadata", { style: sections[lastIdx].style });
    element.appendChild(metaBlock);
  }
}

// tools/importer/import-abonnement-page.js
var parsers = {
  "hero-subscription": parse,
  "cards-steps": parse2,
  "cards-category": parse3,
  "cards-category-brands": parse4,
  "banner": parse5,
  "tabs": parse6,
  "cards-product": parse7,
  "accordion-faq": parse8
};
var transformers = [
  transform
];
var sectionTransformers = [
  transform2
];
var PAGE_TEMPLATE = {
  name: "abonnement-page",
  description: "Subscription landing page promoting coffee subscription plans",
  urls: [
    "https://www.koffievoordeel.nl/abonnement"
  ],
  blocks: [
    {
      name: "hero-subscription",
      instances: [".column.main .pagebuilder-column.shadow-cards"]
    },
    {
      name: "cards-steps",
      instances: [".kv-steps-slider"]
    },
    {
      name: "cards-category",
      instances: [".column.main .coffeType-mobile-icon"]
    },
    {
      name: "cards-category-brands",
      instances: ['.column.main .desktop [class*="brand-abo"]']
    },
    {
      name: "banner",
      instances: ['.column.main img[src*="1440x450_desk"]']
    },
    {
      name: "tabs",
      instances: [".tab-align-left"]
    },
    {
      name: "accordion-faq",
      instances: ['.column.main [data-collapsible="true"]']
    }
  ],
  sections: [
    {
      id: "section-1",
      name: "Hero",
      selector: ".column.main > div:first-of-type",
      style: null,
      blocks: ["hero-subscription"],
      defaultContent: []
    },
    {
      id: "section-2",
      name: "How It Works",
      selector: ".column.main > div:nth-of-type(2)",
      headingMatch: "Hoe werkt het",
      style: null,
      blocks: ["cards-steps"],
      defaultContent: ["#DYDDJVR"]
    },
    {
      id: "section-3",
      name: "Choose Your Coffee",
      selector: ".column.main > div:nth-of-type(3)",
      headingMatch: "Kies je koffie",
      style: null,
      blocks: ["cards-category", "cards-category-brands", "banner"],
      defaultContent: ["#PWJHN6R"]
    },
    {
      id: "section-4",
      name: "Popular Products",
      selector: ".tab-align-left",
      style: null,
      blocks: ["tabs"],
      defaultContent: [".tabs-title"]
    },
    {
      id: "section-5",
      name: "Subscription Explanation",
      selector: "#uitleg",
      headingMatch: "Bespaar",
      style: "beige",
      blocks: [],
      defaultContent: []
    },
    {
      id: "section-6",
      name: "FAQ",
      selector: "#YDF0B3T",
      headingMatch: "Veelgestelde vragen",
      style: null,
      blocks: ["accordion-faq"],
      defaultContent: ["#YDF0B3T"]
    }
  ]
};
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
  if (hookName === "afterTransform") {
    sectionTransformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Section transformer failed:`, e);
      }
    });
  }
}
function findBlocksOnPage(document2, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document2.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}
var import_abonnement_page_default = {
  transform: (payload) => {
    const { document: document2, url, html, params } = payload;
    const main = document2.body;
    executeTransformers("beforeTransform", main, payload);
    const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document: document2, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });
    executeTransformers("afterTransform", main, payload);
    const hr = document2.createElement("hr");
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document2);
    WebImporter.rules.transformBackgroundImages(main, document2);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
    );
    return [{
      element: main,
      path,
      report: {
        title: document2.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name)
      }
    }];
  }
};
export {
  import_abonnement_page_default as default
};
