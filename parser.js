const DOMParser = require('xmldom').DOMParser;
const parser = new DOMParser({
  locator: {},
  errorHandler: { warning: function (w) { }, error: function (e) { }, fatalError: function (f) { } }
});

function bookInfoList(html){
  var bookInfos = []
  var baseUrl = 'http://seat.stdu.edu.cn:8080/opac/'
  // console.log(html)
  var doc = parser.parseFromString(html, "text/html")
  var ol = doc.getElementById('search_book_list')
  if(!ol){
    return null
  }
  var lis = ol.getElementsByTagName('li')
  for (var i=0;i<lis.length;++i){
    bookInfo = {}
    var h3 = lis[i].getElementsByTagName('h3')[0]
    bookInfo.language = h3.getElementsByTagName('span')[0].textContent
    var a = h3.getElementsByTagName('a')[0]
    bookInfo.findCode = a.nextSibling.textContent.replace(/ /g, '')
    var b = a.textContent
    bookInfo.title = b.substring(b.indexOf('.') + 1)
    var href = a.getAttribute('href')
    // var detailLink = baseUrl + href
    // bookInfo.detailLink = detailLink
    bookInfo.marc_no = href.substring(href.indexOf('marc_no=') + 'marc_no='.length)
    var p = lis[i].getElementsByTagName('p')[0]
    var span2 = p.getElementsByTagName('span')[0]
    bookInfo.collection = span2.textContent.replace(/ /g, '').replace(/\t/g, '').replace(/\r/g, '').split('\n')
    bookInfo.author = span2.nextSibling.textContent.replace(/ /g, '')
    var publisherNode = span2.nextSibling.nextSibling.nextSibling.textContent
    bookInfo.publisherInfo = publisherNode.replace(/ /g, '').replace(/\t/g, '').replace(/\n/, '').replace(/\r/, '').split(' ')
    bookInfos.push(bookInfo)
  }
  return bookInfos
}
function bookISBN(html){
  var doc = parser.parseFromString(html, 'text/xml');
  var items = doc.getElementById('item_detail');
  var dls = items.getElementsByTagName('dl');
  for (var i = 0; i < dls.length; ++i) {
    if (dls[i].getElementsByTagName('dt')[0].textContent === 'ISBN及定价:') {
      var isbn = dls[i].getElementsByTagName('dd')[0].textContent.split('/')[0]
      if(isbn.indexOf(' ')!==-1) {
        isbn = isbn.substring(0,isbn.indexOf(' '))
      }
      return isbn
    }
  }
  return null;
}
function bookLent(html){
  var doc = parser.parseFromString(html, 'text/xml');
  var table = doc.getElementsByTagName('table')[0]
  var trs = table.getElementsByTagName('tr')
  var lentInfos = []
  for (var i = 0; i < trs.length - 1; ++i) {
    var tds = trs[i + 1].getElementsByTagName('td')
    lentInfo = {}
    lentInfo.findCode = tds[0].textContent.replace(/ /g, '').replace(/&nbsp;/g, '')
    lentInfo.barCode = tds[1].textContent.replace(/ /g, '').replace(/&nbsp;/g, '')
    lentInfo.njq = tds[2].textContent.replace(/ /g, '').replace(/&nbsp;/g, '')
    lentInfo.location = tds[3].textContent.replace(/ /g, '').replace(/&nbsp;/g, '')
    lentInfo.status = tds[4].textContent.replace(/ /g, '').replace(/&nbsp;/g, '')
    lentInfos.push(lentInfo)
  }
  return lentInfos
}

module.exports = {
  bookInfoList: bookInfoList,
  bookISBN: bookISBN,
  bookLent: bookLent
}
