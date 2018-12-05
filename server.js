const express = require('express');
const request = require('request');
const parser = require('./parser.js')
const url = require('url')
const api = require('./api.js')
const app = express();
const fs = require("fs");

app.get('/bookAPI/bookList', (req, res) => {
    res.setHeader('Content-Type', 'text/json; charset=utf8');
    var params = url.parse(req.url, true).query
    api.simpleSearch(params['title'], e=> {
        var bookInfos = parser.bookInfoList(e)
        res.end(JSON.stringify(bookInfos))
    })
})
app.get('/bookAPI/isbn', (req, res) => {
    res.setHeader('Content-Type', 'text/json; charset=utf8');
    var params = url.parse(req.url, true).query
    api.detailPage(params['marc_no'], e=> {
        var isbn = parser.bookISBN(e)
        res.end(isbn)
    })
})
app.get('/bookAPI/douban', (req, res) => {
    res.setHeader('Content-Type', 'text/json; charset=utf8');
    var params = url.parse(req.url, true).query
    api.doubanBook(params['isbn'], e=> {
        res.end(JSON.stringify(e))
    })
})
app.get('/bookAPI/lent', (req, res) => {
    res.setHeader('Content-Type', 'text/json; charset=utf8');
    var params = url.parse(req.url, true).query
    api.lentInfo(params['marc_no'], e=> {
        var lentInfos = parser.bookLent(e)
        res.end(JSON.stringify(lentInfos))
    })
})


var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})