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
    bookInfos[i] = {}
    var h3 = lis[i].getElementsByTagName('h3')[0]
    var span = h3.getElementsByTagName('span')[0].textContent
    bookInfos[i].language = span
    var a = h3.getElementsByTagName('a')[0]
    var findCode = a.nextSibling.textContent.replace(/ /g, '')
    bookInfos[i].findCode = findCode
    var b = a.textContent
    var title =  b.substring(b.indexOf('.') + 1)
    bookInfos[i].title = title
    var href = a.getAttribute('href')
    // var detailLink = baseUrl + href
    // bookInfos[i].detailLink = detailLink
    var marc_no = href.substring(href.indexOf('marc_no=') +'marc_no='.length)
    bookInfos[i].marc_no = marc_no
    var p = lis[i].getElementsByTagName('p')[0]
    var span2 = p.getElementsByTagName('span')[0]
    var collection = span2.textContent.replace(/ /g, '').replace(/\t/g, '').replace(/\r/g, '').split('\n')
    bookInfos[i].collection = collection
    var author = span2.nextSibling.textContent.replace(/ /g, '')
    bookInfos[i].author = author
    var publisherNode = span2.nextSibling.nextSibling.nextSibling.textContent
    var publisherInfo = publisherNode.replace(/ /g, '').replace(/\t/g, '').replace(/\n/, '').replace(/\r/, '').split(' ')
    bookInfos[i].publisherInfo = publisherInfo
  }
  return bookInfos
}
function bookISBN(html){
  var doc = parser.parseFromString(html, 'text/xml');
  var items = doc.getElementById('item_detail');
  var dls = items.getElementsByTagName('dl');
  for (var i = 0; i < dls.length; ++i) {
    if (dls[i].getElementsByTagName('dt')[0].textContent == 'ISBN及定价:') {
      var isbn = dls[i].getElementsByTagName('dd')[0].textContent.split('/')[0]
      if(isbn.indexOf(' ')!=-1) {
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
    lentInfos[i] = {}
    lentInfos[i].findCode = tds[0].textContent.replace(/ /g, '').replace(/&nbsp;/g, '')
    lentInfos[i].barCode = tds[1].textContent.replace(/ /g, '').replace(/&nbsp;/g, '')
    lentInfos[i].njq = tds[2].textContent.replace(/ /g, '').replace(/&nbsp;/g, '')
    lentInfos[i].location = tds[3].textContent.replace(/ /g, '').replace(/&nbsp;/g, '')
    lentInfos[i].status = tds[4].textContent.replace(/ /g, '').replace(/&nbsp;/g, '')
  }
  return lentInfos
}

module.exports = {
  bookInfoList: bookInfoList,
  bookISBN: bookISBN,
  bookLent: bookLent
}
