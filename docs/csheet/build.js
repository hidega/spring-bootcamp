const fs = require('node:fs/promises'); 
const process = require('node:process');
const topicsDir = './topics';

let idCounter = 0;

const createTopic = (s) => {
  const first = s.indexOf('\n');
  const second = s.indexOf('\n', first + 1);
  const third = s.indexOf('\n', second + 1);
  const topic = {};
  topic.chapter = s.substring(0, first).trim();
  topic.title = s.substring(first, second).trim();
  topic.tags = s.substring(second, third).trim();
  topic.text = s.substring(third);
  topic.id = ++idCounter;
  return topic;
};

const exitError = (m) => {
  console.log('\nERROR: ' + m);
  process.exit(1);
};

const readFile = (a, f) => {
  a.push(fs.readFile(topicsDir + '/' + f));
  return a;
};

const createDocument = (ts) => {
  const addToChapter = (a, t) => {
    a[t.chapter] || (a[t.chapter] = {});
    a[t.chapter][t.title] = Object.assign({}, t);
    return a;
  };
  return ts.reduce(addToChapter, {}); 
};

const appendTopic = (n, t, h) => h + 
  `<div data-tags="${t.tags}" class="cs-paragraph" id="${t.id}">` +
  `<div class="cs-title">${t.title}</div><div class="cs-text">${t.text}</div>`; 

const appendChapter = (n, c, h) => h + 
  `<div class="cs-chapter" data-chapter-name="${n}">` + 
  Object.keys(c).reduce((a, k) => appendTopic(k, c[k], a), '') + 
  '</div>';

const htmlize = (d) => '<div class="cs-bg">' + 
  Object.keys(d).reduce((a, k) => appendChapter(k, d[k], a), '') + 
  '</div>';

fs.readdir(topicsDir)
  .then((fa) => Promise.all(fa.reduce(readFile, [])))
  .then((bs) => bs.map((b) => createTopic(b.toString('utf-8'))))
  .then(createDocument)
  .then(htmlize)
  .then(console.log)
  .then(() => console.log('Success :)'))
  .catch(exitError);
