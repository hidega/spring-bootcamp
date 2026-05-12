const scrollToElement = (id) => document.getElementById(id)?.scrollIntoView();

const enableLinkClicks = () => Array.from(document.getElementsByClassName('cs-link'))
  .forEach((e) => e.addEventListener('click', () => scrollToElement(e.attributes.getNamedItem('data-ref')?.value)));

const start = () => {
  enableLinkClicks();
};

window.addEventListener('load', start);
