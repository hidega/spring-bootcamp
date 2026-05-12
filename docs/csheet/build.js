const fs = require('node:fs/promises'); 
const process = require('node:process');
const topicsDir = './topics'; 

const createTopic = (s) => {
  const first = s.indexOf('\n');
  const second = s.indexOf('\n', first + 1);
  const third = s.indexOf('\n', second + 1);
  const topic = {};
  topic.chapter = s.substring(0, first).trim();
  topic.title = s.substring(first, second).trim();
  topic.tags = s.substring(second, third).trim();
  topic.text = s.substring(third);
  topic.id = (topic.chapter + '-' + topic.title).replaceAll(' ', '_').toLowerCase();
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

const appendParagraph = (n, t, h) => h + 
  `<div data-tags="${t.tags}" class="cs-paragraph" id="${t.id}">\n` +
  `<div class="cs-title">${t.title}</div><div class="cs-text">${t.text}</div></div>\n`; 

const appendChapter = (n, c, h) => h + 
  `<div class="cs-chapter" data-chapter-name="${n}"><div class="cs-title">${n}</div>\n` +  
  Object.keys(c).reduce((a, k) => appendParagraph(k, c[k], a), '') + 
  '</div>\n';

const htmlize = (d) => '<div class="cs-textbg" id="cs-textbg">' + 
  Object.keys(d).reduce((a, k) => appendChapter(k, d[k], a), '') + 
  '</div>\n';

const createHtmlPage = (c) => 
`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>CSheet</title>
    <link href="http://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css"/>
    <link rel="stylesheet" href="styles.css" type="text/css"/>
    <script type="text/javascript" src="csheet.js"></script>
  </head>
  <body> 
    <div class="cs-bg" id="cs-bg">

${c}
      <div class="cs-keyboard">
        <div class="cs-entryrow">
          <div class="cs-entryfield" id="cs-entryfield"></div><div class="cs-key">Bksp</div><div class="cs-key">Clear</div><div class="cs-key">Up</div><div class="cs-key">Down</div>
        </div>
        <div class="cs-topkeyrow">
          <div class="cs-key">Q</div><div class="cs-key">W</div><div class="cs-key">E</div><div class="cs-key">R</div><div class="cs-key">T</div><div class="cs-key">Z</div><div class="cs-key">U</div><div class="cs-key">I</div><div class="cs-key">O</div><div class="cs-key">P</div>
        </div>
        <div class="cs-middlekeyrow">
          <div class="cs-key">A</div><div class="cs-key">S</div><div class="cs-key">D</div><div class="cs-key">F</div><div class="cs-key">G</div><div class="cs-key">H</div><div class="cs-key">J</div><div class="cs-key">K</div><div class="cs-key">L</div>
        </div>
        <div class="cs-bottomkeyrow">
          <div class="cs-key">Y</div><div class="cs-key">X</div><div class="cs-key">C</div><div class="cs-key">V</div><div class="cs-key">B</div><div class="cs-key">N</div><div class="cs-key">M</div>
        </div>
      </div> 
    </div>
  </body>
</html>
`;

fs.readdir(topicsDir)
  .then((fa) => Promise.all(fa.sort().reduce(readFile, [])))
  .then((bs) => bs.map((b) => createTopic(b.toString('utf-8'))))
  .then(createDocument)
  .then(htmlize)
  .then(createHtmlPage)
  .then((s) => fs.writeFile('./index.html', s))
  .then(() => console.log('Success :)'))
  .catch(exitError);
