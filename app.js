#!/env/bin/node
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

var url = 'https://forums.sufficientvelocity.com/threads/e-l-f-extraterrestrial-lifeform.30454/';
JSDOM.fromURL(url).then(dom => {
  console.log(dom.serialize());
});

function fromFragment(dom) { // retrieves element hash links to
  return document.getElementById(dom.location.hash.substr(1));
}

function getAuthor(author, dom) {
  return dom.querySelectorAll("li[data-author='" + author + "']"); // selects every list item
}

function getPostContent(post) { // takes input from getAuthor
  var content = post.getElementsByClassName("messageText")[0];
  let mark = content.getElementsByClassName("messageTextEndMarker");
  if(mark.length > 0) content.removeChild(mark[0]); // if there is an end text marker remove it
  return content;
}

function parseThread(url,callback) {
  url = new URL(url);
  let parser = url.host;
}
