// app.js
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const url = require('url'); // node url not WHATWG URL API
const req = require('requisition');
// DEBUG START
var site = 'https://forums.sufficientvelocity.com/threads/e-l-f-extraterrestrial-lifeform.30454/';
// DEBUG END
 
async function XFParse(site) { // XenForo Parser
  var dom;
  // below replace should strip off /threadmarks and /reader from url
  site.href = site.href.replace(/\/(?:(?:reader)|(?:threadmarks))\/?(?:page\/[0-9]*\/?)?$/,'');
  await req(site.href).redirects(10).then((res) => {
    let doc = await res.text().then(text => {
      return text;
    });;
    dom = jsdom.jsdom(doc.text());
  }).catch(err => {console.log(err);});
  this.fromFragment = () => { // retrieves element hash links to
    return dom.document.getElementById(dom.location.hash.substr(1));
  }
  this.getAuthor = author => {
    return dom.document.querySelectorAll("li[data-author='" + author + "']"); // selects every list item
  }
  this.resetDOM = async () => {
    await req(site.href).then((res) => {
      let doc = await res.text().then(text => {
        return text;
      });
      dom = jsdom.jsdom(doc.text());
    }).catch(err => {console.log(err);});
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
    await req(site.href.replace(/\/?$/,'reader')).redirects(10).then((res) => {
      let doc = await res.text().then(text => {
        return text;
      });
      dom = jsdom.jsdom(doc.text());
      posts = this.getAllPosts();
      this.resetDOM();
    }).catch(err => {console.log(err);});
    return posts;
  }
  this.getAllPosts = () => {
    var posts = []; // array of strings of posts
    posts.push(dom.document.getElementsByClassName('message').forEach((post,i,array) => {
      array[i] = this.getPostContent(post);
    }));
    return posts;
  }
  return await this.getThreadmarks();
}
async function parseThread(site,callback) { // will fallback on default parsers if no callback
  site = url.parse(site);
  if(typeof callback !== 'function') {
    var parser = site.host;
    if(parser==='forums.spacebattles.com' || parser==='forums.sufficientvelocity.com') {
      console.log("parsing...");
      parser = await XFParse(site);
      console.log("parsing complete.");
      console.log("writing file...");
      fs.writeFileSync('test.txt',parser);
      console.log("file written");
    }
  } else {
    parser = new callback(site);
  }
}
parseThread(site);
