#!/env/bin/node
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
// DEBUG START
var url = 'https://forums.sufficientvelocity.com/threads/e-l-f-extraterrestrial-lifeform.30454/';

// DEBUG END

function XFParse(url) { // XenForo Parser
  var dom;
  // below replace should strip off /threadmarks and /reader from url
  url.href = url.href.replace(/\/(?:reader)|(?:threadmarks)(?:\/(?:page\/[0-9]*\/?)?)?$/,'');
  JSDOM.fromURL(url).then((doc) => {
    dom = doc;
  });
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
  this.getThreadmarks() {
    var dom;
    JSDOM.fromURL(url.href.replace(/\/?$/,'reader')).then((doc) => {
    dom = doc;
    }
  }
}

function parseThread(url,callback) { // will fallback on default parsers if no callback
  url = new URL(url);
  if(typeof callback !== 'function') {
    var parser = url.host;
    if(parser==='forums.spacebattles.com' || parser==='forums.sufficientvelocity.com') {
      parser = new XFParse(url);
      fs.writeFile
    }
  } else {
    parser = new callback(url);
  }
}
