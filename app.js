#!/env/bin/node
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

var url = 'https://forums.sufficientvelocity.com/threads/e-l-f-extraterrestrial-lifeform.30454/';
JSDOM.fromURL(url).then(dom => {
  console.log(dom.serialize());
});
