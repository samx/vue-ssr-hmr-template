const Hapi = require('hapi'),
    path = require('path');
global.NODE_ENV = process.env.NODE_ENV || 'production'

const PORT = 8080
const isDev = NODE_ENV === 'development';
const bell = {
    provider: 'google',
    isSecure: false,
    password: 'password‐that‐is‐at‐least‐32‐chars',
    clientId: '329871581471-f1prr8pontn6lptaub8jacodgguu216b.apps.googleusercontent.com',
    clientSecret: 'uwQZhVBbI7SJ4w2T4kmDVE0K',
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.force-ssl']
};

const server = new Hapi.Server();
server.connection({
    port: PORT
});

server.register([
    { register: require('hapi-auth-cookie') },
    { register: require('inert') },
    { register: require('vision') },
    { register: require('bell') },
], function () {

});

server.register([
    { register: require('./server/plugins/assets') },

    { register: require('./server/plugins/postgresDB') },

    {
        register: require('./server/plugins/auth'),
        options: {
            bell: bell
        }
    },
    { register: require('./server/plugins/siteUI') },

    {
        register: require('./server/plugins/youtubeAPI'),
        options: {
            bell: bell
        }
    }
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
