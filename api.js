const request = require('request')
const qs = require('querystring')

const optionMap = {
  fieldCodes: {
    '任意词': 'any',
    '题名': '02',
    '责任者': '03',
    '主题词': '04',
    'ISBN': '05',
    '分类号': '07',
    '索书号': '08',
    '出版社': '09',
    '丛书名': '10'
  },
  sortFields: {
    '相关度': 'relevance',
    '入藏日期': 'cataDate',
    '题名': 'title',
    '责任者': 'author',
    '索书号': 'callNo',
    '出版社': 'publisher',
    '出版日期': 'pubYear'
  },
  sortTypes: {
    '升序排列': 'asc',
    '降序排列': 'desc'
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
function bookDetail(code, value, fn){
  if(!value) return
  postDatas.searchWords[0].fieldList[0].fieldCode = optionMap.fieldCodes[code]
  postDatas.searchWords[0].fieldList[0].fieldValue = value
  const baseURL = 'http://seat.stdu.edu.cn:8080/opac/ajax_search_adv.php';
  var options = {
    url: baseURL,
    method: 'POST',
    header: {},
    json: true,
    body: postDatas
  }
  request(options, (error, response, body)=> {
    if(!error && response.statusCode==200){
      fn(body);
    }
    else{
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
    if(!error && response.statusCode==200){
      fn(body);
    }
    else{
      console.log(error);
      fn(null);
    }
  })
}
function simpleSearch(name, fn){
  const baseURL = 'http://seat.stdu.edu.cn:8080/opac/openlink.php?'
  var data = {
    'strText': name,
    'historyCount': '1',
    'strSearchType': 'title',
    'doctype': 'ALL',
    'match_flag': 'forward',
    'displaypg': '10',
    'sort': 'CATA_DATE',
    'orderby': 'desc',
    'showmode': 'list',
    'dept': 'ALL'
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
    if(!error && response.statusCode==200){
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
    if(!error && response.statusCode==200){
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
    if(!error && response.statusCode==200){
      fn(body);
    }
    else{
      console.log(error);
    }
  })
}
module.exports = {
  bookDetail: bookDetail,
  doubanBook: doubanBook,
  simpleSearch: simpleSearch,
  detailPage: detailPage,
  lentInfo: lentInfo
}
