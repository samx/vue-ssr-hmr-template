'use strict';
const pug = require('pug')
const path = require('path')
const VueSSR = require('vue-ssr')
const serverConfig = require('../../../build/webpack.server')
const renderOptions = {
    cache: require('lru-cache')({ max: 10240, maxAge: 1000 * 60 * 15 })
}
const indexRenderer = new VueSSR({
    projectName: 'index',
    contextHandler: function (req) {
        return {
            url: req.url,
            helloWorld: 'Hello World 2'
        }
    },
    renderOptions,
    webpackServer: serverConfig
})

function render(view, data) {
    return pug.compileFile(path.join(__dirname, './views/' + view + '.pug'), { cache: true })(data)
}

function index(req, reply) {
    const template = render('index', { title: 'Hotkeys', bundle: 'index' })
    indexRenderer.render(req, reply, template)
}

exports.register = function (server, options, next) {
    server.dependency(['vision'], (server, next) => {
        server.views({
            engines: {
                pug: require('pug')
            },
            path: path.join(__dirname, 'views')
        });
        //request, reply
        server.route({ method: 'GET', path: '/', handler: index });
        server.route({ method: 'GET', path: '/home', handler: index });
        server.route({ method: 'GET', path: '/article', handler: index });
        server.route({ method: 'GET', path: '/tag', handler: index });

        server.route({
            method: 'GET', path: '/login', handler: function (request, reply) {
                reply(render('login', { title: 'login', bundle: 'login' }))
            }
        });



        next();
    });
    next();
}

exports.register.attributes = {
    name: 'siteUI'
}