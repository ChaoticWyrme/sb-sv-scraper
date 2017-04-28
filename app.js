#!/env/bin/node
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
// DEBUG START
var url = 'https://forums.sufficientvelocity.com/threads/e-l-f-extraterrestrial-lifeform.30454/';
JSDOM.fromURL(url).then(dom => {
  console.log(dom.serialize());
});
// DEBUG END

function XFParse(url) { // XenForo Parser
  var dom;
  JSDOM.fromURL(url).then((doc) => {
    dom = doc;
  }
  this.fromFragment = () => { // retrieves element hash links to
    return document.getElementById(dom.location.hash.substr(1));
  }
  this.getAuthor = (author) => {
    return dom.querySelectorAll("li[data-author='" + author + "']"); // selects every list item
  }
  this.getPostContent (post) => { // takes input from getAuthor
    var content = post.getElementsByClassName("messageText")[0];
    let mark = content.getElementsByClassName("messageTextEndMarker");
    if(mark.length > 0) content.removeChild(mark[0]); // if there is an end text marker remove it
    return content;
  }
}

function parseThread(url,callback) { // will fallback on default parsers if no callback
  url = new URL(url);
  if(typeof callback !== 'function') {
    var parser = url.host;
    if(parser==='forums.spacebattles.com' || parser==='forums.sufficientvelocity.com') {
      parser = new XFParse(url);
    }
  } else {
    parser = new callback(url);
  }
}
