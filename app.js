const Hapi = require('hapi');
const path = require('path')
global.NODE_ENV = process.env.NODE_ENV || 'production'

const PORT = 8080
const isDev = NODE_ENV === 'development';

const server = new Hapi.Server();
server.connection({
    port: PORT
});

server.register([
    require('inert'),
    require('vision'),
    require('./server/plugins/assets'),
    require('./server/plugins/siteUI')
], function (err) {

});

if (isDev) {
    // local variables for all views
    //app.locals.env = NODE_ENV;
    //app.locals.reload = true;

    // static assets served by webpack-dev-middleware & webpack-hot-middleware for development
    const webpackDevConfig = require('./build/webpack.config.js')

    const HapiWebpackDevMiddleware = require('hapi-webpack-dev-middleware');
    const HapiWebpackHotMiddleware = require('hapi-webpack-hot-middleware');

    server.register([{
        register: HapiWebpackDevMiddleware,
        options: {
            config: webpackDevConfig,
            options: {
                noInfo: true,
                historyApiFallback: true,
                publicPath: webpackDevConfig.output.publicPath,
                stats: {
                    colors: true
                }
            }
        }
    }, {
        register: HapiWebpackHotMiddleware
    }
    ], function (err) {
        if (err) throw err;
    });

    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
        if (process.env.NODE_ENV === 'development') {
            //require("open")(`http://localhost:${PORT}`);
        }
    });
} else {
    console.log('not development');
}
