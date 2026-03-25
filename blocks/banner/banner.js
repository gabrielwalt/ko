import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const desktopRow = rows[0];
  const mobileRow = rows[1];

  const desktopImg = desktopRow?.querySelector('img');
  const mobileImg = mobileRow?.querySelector('img');

  if (!desktopImg && !mobileImg) return;

  const picture = document.createElement('picture');

  if (desktopImg) {
    const optimized = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]);
    const sources = optimized.querySelectorAll('source');
    sources.forEach((source) => {
      source.media = '(min-width: 600px)';
      picture.appendChild(source);
    });
  }

  const fallbackSrc = mobileImg || desktopImg;
  if (fallbackSrc) {
    const optimized = createOptimizedPicture(fallbackSrc.src, fallbackSrc.alt, false, [{ width: '750' }]);
    const img = optimized.querySelector('img');
    if (img) {
      moveInstrumentation(fallbackSrc, img);
      picture.appendChild(img);
    }
  }

  block.textContent = '';
  block.appendChild(picture);
}
