'use strict';
module.exports = new Promise((resolve, reject) => {
    try {

        var restify = require('restify');
        restify.CORS.ALLOW_HEADERS.push('authorization');

        var passport = require('passport');
        var server = restify.createServer();

        var json2xls = require('json2xls');
        server.use(json2xls.middleware);

        server.use(restify.queryParser());
        server.use(restify.bodyParser());
        server.use(restify.CORS({
            headers: ['Content-Disposition']
        }));

        server.use(passport.initialize());
        server.use(function (request, response, next) {
            var query = request.query;
            query.order = !query.order ? {} : JSON.parse(query.order);
            query.filter = !query.filter ? {} : JSON.parse(query.filter);
            request.queryInfo = query;
            next();
        });

        var v1InventoryDocumentRouter = require('./src/routers/v1/inventory/inventory-document-router');
        v1InventoryDocumentRouter.applyRoutes(server, "/v1/inventory/inventory-document");

        server.listen(process.env.PORT, process.env.IP);
        console.log(`server created at ${process.env.IP}:${process.env.PORT}`);
        resolve(`${process.env.IP}:${process.env.PORT}`);
    }
    catch (e) {
        reject(e);
    };
});