const removeDuplicates = (a) => a.filter((e, i) => a.indexOf(e) === i);

const findInIndex = (s, t = '_' + s) => {
  let result = [];
  if(t.length > 2) {
    const exactTagMatches = window.csheet.index.tags[t] || [];
    const exactTitleMatches = window.csheet.index.titles[t] || [];
    const fragmentTagMatches = Object.keys(window.csheet.index.tags)
      .filter((k) => k.includes(s))
      .reduce((a, k) => a.concat(window.csheet.index.tags[k]), []); 
    const fragmentTitlegMatches = Object.keys(window.csheet.index.titles)
      .filter((k) => k.includes(s))
      .reduce((a, k) => a.concat(window.csheet.index.titles[k]), []);
    result = removeDuplicates(exactTagMatches.concat(exactTitleMatches, fragmentTagMatches, fragmentTitlegMatches));
  }
  return result;
};

const displayResultsPanel = (h) => {
  const panel = document.createElement('div')
  panel.className = 'cs-resultspanel';
  panel.id = 'cs-resultspanel';
  document.getElementById('cs-bg').appendChild(panel);
  return panel;
};

const clearEntryField = () => document.getElementById('cs-entryfield').innerHTML = '';

const onResultClick = (id) => {
  destroyResultsPanel();
  scrollToElement(id);
  clearEntryField();
};

const createResultEntry = (e) => {
  const entry = document.createElement('div');
  entry.innerHTML = e.title;
  entry.className = 'cs-resultentry';
  entry.addEventListener('click', () => onResultClick(e.id));
  return entry;
};

const doUpdateResultsPanel = (indexResults) => {
  console.log(indexResults);
  const resultsPanel = document.getElementById('cs-resultspanel') || displayResultsPanel();
  while (resultsPanel.firstChild) {
    resultsPanel.removeChild(resultsPanel.firstChild);
  }
  indexResults.forEach((e) => resultsPanel.appendChild(createResultEntry(e)));
}

const updateResultsPanel = (s) => {
  const maxResults = 25;
  const indexResults = findInIndex(s).map((i) => ({ 
      id: i, 
      title: document.getElementById(i).firstElementChild.innerHTML.toLowerCase() 
    }))
    .slice(0, maxResults);
  if(indexResults.length < 1) {
    destroyResultsPanel();
  } else {
    doUpdateResultsPanel(indexResults);
  }
};

const destroyResultsPanel = () => {
  let e = document.getElementById('cs-resultspanel');
  e?.remove();
  e = null;
};

const scrollText = (d) => document.getElementById('cs-textbg')
  .scrollBy({ top: d * window.visualViewport.height, left: 0, behavior: 'smooth'});

const onBackspace = (e) => {
  if(e.innerHTML) {
    e.innerHTML = e.innerHTML.slice(0, -1);
    if(e.innerHTML) {
      updateResultsPanel(e.innerHTML);
    } else {
      destroyResultsPanel();
    }
  }
};

const onKeyClick = (e) => { 
  const entryField = document.getElementById('cs-entryfield');
  const doScroll = (d) => {
    destroyResultsPanel();
    clearEntryField();
    scrollText(d);
  };
  if(e.target.innerHTML === 'Clear') {
    clearEntryField();
    destroyResultsPanel();
  } else if(e.target.innerHTML === 'Bksp') {
    onBackspace(entryField);
  } else if(e.target.innerHTML === 'Up') { 
    doScroll(0.3333);
  } else if(e.target.innerHTML === 'Down') {
    doScroll(-0.3333);
  } else {
    entryField.innerHTML += e.target.innerHTML.toLowerCase();
    updateResultsPanel(entryField.innerHTML);
  }
};

const buildIndex = () => {
  const index = { tags: {}, titles: {} };
  const addTagToIndex = (tn, i, t = '_' + tn) => { 
    index.tags[t] || (index.tags[t] = []);
    index.tags[t].push(i);
  };
  const addTitleToIndex = (ti, i, t = '_' + ti) => {
    index.titles[t] || (index.titles[t] = []);
    index.titles[t].push(i);
  };
  const processIndexEntry = (e) => {
    e.tags.split(' ').forEach((t) => t && addTagToIndex(t, e.id));
    e.title.split(' ').forEach((t) => t && addTitleToIndex(t, e.id));
  };
  Array.from(document.getElementsByClassName('cs-paragraph'))
    .map((e) => ({
      tags: e.getAttribute('data-tags'),
      id: e.getAttribute('id'),
      title: e.firstElementChild.innerHTML.toLowerCase()
    }))
    .forEach(processIndexEntry); 
  window.csheet.index = index;
};

const enableKeyboard = () => {
  buildIndex();
  Array.from(document.querySelectorAll('.cs-keyboard .cs-key'))
    .forEach((e) => e.addEventListener('click', onKeyClick));
};

const scrollToElement = (id) => document.getElementById(id)?.scrollIntoView();

const enableLinkClicks = () => Array.from(document.getElementsByClassName('cs-link'))
  .forEach((e) => e.addEventListener('click', () => scrollToElement(e.attributes.getNamedItem('data-ref')?.value)));

const start = () => {
  window.csheet = {};
  enableLinkClicks();
  enableKeyboard();
};

window.addEventListener('DOMContentLoaded', start);
