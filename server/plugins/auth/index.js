'use strict';
const google = require('googleapis');
const googleAuth = require('./googleAPIAuthSetup');
let OAuth2, oauth2Client;

exports.register = function (server, options, next) {
    server.dependency(['bell', 'hapi-auth-cookie'], (server, next) => {
        OAuth2 = google.auth.OAuth2;
        oauth2Client = new OAuth2(
            options.bell.clientId,
            options.bell.clientSecret
        );
        // Configure cookie auth scheme
        var authCookieOptions = {
            password: 'password-should-be-32-characters',
            cookie: 'sid',
            isSecure: false,
            isSameSite: 'Lax'
        };
        server.auth.strategy('google', 'bell', options.bell);
        server.auth.strategy('siteCookieAuth', 'cookie', 'try', authCookieOptions);

        server.route({
            method: 'GET',
            path: '/verify',
            handler: function (request, reply) {
                reply({
                    'isAuthenticated': request.auth.isAuthenticated,
                    'credentials': request.auth.credentials,
                    'cookie': request.cookieAuth
                })
            }
        })

        server.route({
            method: 'GET',
            path: '/clear',
            handler: function (request, reply) {
                request.cookieAuth.clear();
                reply('cookie cleared');
            }
        })

        server.route({
            method: ['POST', 'GET'],
            path: '/google-auth',
            config: {
                auth: 'google'
            },
            handler: function (request, reply) {
                if (request.auth.isAuthenticated) {

                    const credentials = request.auth.credentials;
                    let refresh_token = credentials.refreshToken;

                    server.app.db.func('users_is_new_google_id', [credentials.profile.id])
                        .then(data => {
                            let is_new_google_id = data[0].google_id_exist != true;

                            let accountCredentials = {
                                google_id: credentials.profile.id,
                                token: credentials.token,
                                refresh_token: credentials.refreshToken,
                                expiry: (new Date()).getTime() + 3600000
                            }

                            if (is_new_google_id) { //first-time login
                                googleAuth.getNewTokensIfExpired(oauth2Client, accountCredentials)
                                    .then(function (tokens) {
                                        //get youtube channel id from api to include in user account creation
                                        var service = google.youtube('v3');
                                        service.channels.list({
                                            auth: oauth2Client,
                                            part: 'contentDetails',
                                            mine: true
                                        }, function (err, response) {
                                            if (err) { console.log('The API returned an error: ' + err); return; }
                                            var channel_id = response.items[0].id;
                                            console.log('channel id:', channel_id)
                                            server.app.db.func('users_create_user', [
                                                credentials.profile.id,
                                                credentials.profile.email,
                                                credentials.profile.displayName,
                                                credentials.profile.raw.picture,
                                                credentials.token,
                                                credentials.refreshToken,
                                                channel_id
                                            ])
                                                .then(() => {
                                                    request.cookieAuth.clear();
                                                    request.cookieAuth.set(accountCredentials);
                                                    return reply.redirect('/');

                                                })
                                        });
                                    });
                            } else { // existing user re-login
                                server.app.db.func('users_update_user_by_google_id', [
                                    credentials.profile.id,
                                    credentials.profile.email,
                                    credentials.profile.displayName,
                                    credentials.profile.raw.picture,
                                    credentials.token,
                                    credentials.refreshToken
                                ])
                                    .then((data) => {
                                        accountCredentials.refreshToken = data[0].refresh_token;
                                        request.cookieAuth.clear();
                                        request.cookieAuth.set(accountCredentials);
                                        return reply.redirect('/');
                                    })
                            }
                        })
                } else {
                    console.log('rejected!');
                    return reply.redirect('/auth');
                }
            }
        });
        next();
    });
    next();
}

exports.register.attributes = {
    name: 'auth',
    version: '0.0.1'
}