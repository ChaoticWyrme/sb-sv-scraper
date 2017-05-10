// app.js
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const url = require('url'); // node url not WHATWG URL API
// DEBUG START
var site = 'https://forums.sufficientvelocity.com/threads/e-l-f-extraterrestrial-lifeform.30454/';
// DEBUG END

async function XFParse(site) { // XenForo Parser
  var dom;
  // below replace should strip off /threadmarks and /reader from url
  site.href = site.href.replace(/\/(?:reader)|(?:threadmarks)(?:\/(?:page\/[0-9]*\/?)?)?$/,'');
  await JSDOM.fromURL(site.href).then((doc) => {
    dom = doc;
  });
  this.fromFragment = () => { // retrieves element hash links to
    return document.getElementById(dom.location.hash.substr(1));
  }
  this.getAuthor = author => {
    return dom.querySelectorAll("li[data-author='" + author + "']"); // selects every list item
  }
  this.resetDOM = async () => {
    await JSDOM.fromURL(site.href).then((doc) => {
      dom = doc;
    });
    return true;
  }
  this.getPostContent = (post) => { // takes input from getAuthor
    var content = post.getElementsByClassName("messageText")[0];
    let mark = content.getElementsByClassName("messageTextEndMarker");
    if(mark.length > 0) content.removeChild(mark[0]); // if there is an end text marker remove it
    return content;
  }
  this.getThreadmarks = async () => {
    var posts;
    await JSDOM.fromURL(site.href.replace(/\/?$/,'reader')).then((doc) => {
      dom = doc;
      posts = this.getAllPosts();
      this.resetDOM();
    });
    return posts;
  }
  this.getAllPosts = () => {
    var posts = []; // array of strings of posts
    posts.push(dom.getElementsByClassName('message').forEach((post,i,array) => {
      array[i] = this.getPostContent(post);
    }));
    return posts;
  }
}
function parseThread(site,callback) { // will fallback on default parsers if no callback
  site = url.parse(site);
  if(typeof callback !== 'function') {
    var parser = site.host;
    if(parser==='forums.spacebattles.com' || parser==='forums.sufficientvelocity.com') {
      console.log("parsing...");
      parser = new XFParse(site);
      console.log("parsing complete.");
      console.log("writing file...");
      fs.writeFileSync('test.txt',parser.getThreadmarks());
      console.log("file written");
    }
  } else {
    parser = new callback(site);
  }
}
parseThread(site);
