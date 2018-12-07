const request = require('request')
const qs = require('querystring')

const optionMap = {
  fieldCodes: {
    'any': 'any',
    'title': '02',
    'author': '03',
    'subWord': '04',
    'ISBN': '05',
    'kindNum': '07',
    'findCode': '08',
    'pubNum': '09',
    'bookName': '10'
  },
  sortFields: {
    'relative': 'relevance',
    'saveDate': 'cataDate',
    'title': 'title',
    'author': 'author',
    'findCode': 'callNo',
    'pubNum': 'publisher',
    'pubDate': 'pubYear'
  },
  sortTypes: {
    'asc': 'asc',
    'desc': 'desc'
  }
}
var postDatas = {
  searchWords: [{
    fieldList: [{
      fieldCode: null,
      fieldValue: null
    }]
  }],
  filters: [],
  limiter: [],
  sortField: "relevance",
  sortType: "desc",
  pageSize: 20,
  pageCount: 1,
  locale: "",
  first: true
}
function advSearch(code, value, pageCount, sortMethod, fn){
  postDatas.searchWords[0].fieldList[0].fieldCode = optionMap.fieldCodes[code]
  postDatas.searchWords[0].fieldList[0].fieldValue = value
  postDatas.sortField = sortMethod?sortMethod:'relevance'
  postDatas.pageCount = pageCount?pageCount:1
  const baseURL = 'http://seat.stdu.edu.cn:8080/opac/ajax_search_adv.php';
  var options = {
    url: baseURL,
    method: 'POST',
    header: {},
    json: true,
    body: postDatas
  }
  request(options, (error, response, body)=> {
    if(!error && response.statusCode===200){
      fn(body);
    }
    else{
      fn(null)
      console.log(error);
    }
  })
}
function doubanBook(isbn, fn){
  const baseURL = 'https://douban.uieee.com/v2/book/isbn/'
  var options = {
    url: baseURL + isbn,
    method: 'GET',
    header: {
      'Content-Type': 'application/xml'
    },
    json: true,
    body: {}
  }
  request(options, (error, response, body)=> {
    if(!error && response.statusCode===200){
      fn(body);
    }
    else{
      console.log(error);
      fn(null);
    }
  })
}
function simpleSearch(name, pageCount, fn){
  const baseURL = 'http://seat.stdu.edu.cn:8080/opac/openlink.php?'
  var data = {
    "location": "ALL",
    "title": name,
    "doctype": "ALL",
    "lang_code": "ALL",
    "match_flag": "forward",
    "displaypg": "20",
    "showmode": "list",
    "orderby": "DESC",
    "sort": "CATA_DATE",
    "onlylendable": "no",
    "count": "242",
    "with_ebook": "on",
    "page": pageCount
  };
  var content = qs.stringify(data);
  var options = {
    url: baseURL + content,
    method: 'GET',
    header: {},
    json: true,
    body: {}
  }
  console.log(options)
  request(options, (error, response, body)=> {
    if(!error && response.statusCode===200){
      fn(body);
    }
    else{
      console.log('error: ' + error);
    }
  })
}
function detailPage(marcRecNo, fn) {
  const baseURL = 'http://seat.stdu.edu.cn:8080/opac/item.php?'
  var data = {
    marc_no: marcRecNo
  };
  var content = qs.stringify(data);
  var options = {
    url: baseURL + content,
    method: 'GET',
    header: {},
    json: true,
    body: {}
  }
  request(options, (error, response, body)=> {
    if(!error && response.statusCode===200){
      fn(body);
    }
    else{
      console.log(error);
    }
  })
}
function lentInfo(marcRecNo, fn) {
  const baseURL = 'http://seat.stdu.edu.cn:8080/opac/ajax_item.php?';
  var data = {
    marc_no: marcRecNo
  };
  var content = qs.stringify(data);
  var options = {
    url: baseURL + content,
    method: 'GET',
    header: {},
    json: true,
    body: {}
  }
  request(options, (error, response, body)=> {
    if(!error && response.statusCode===200){
      fn(body);
    }
    else{
      console.log(error);
    }
  })
}
module.exports = {
  advSearch: advSearch,
  doubanBook: doubanBook,
  simpleSearch: simpleSearch,
  detailPage: detailPage,
  lentInfo: lentInfo
}
