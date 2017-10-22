'use strict';
const axios = require('axios');
const vttToJSON = require('vtt-to-json');
const google = require('googleapis');
const googleAuth = require('../auth/googleAPIAuthSetup');

let OAuth2, oauth2Client;

function tokenVerified(request, reply) {
    googleAuth.getNewTokensIfExpired(oauth2Client, request.auth.credentials)
        .then(function (tokens) {
            console.log('test0');
            if (tokens.expired !== true) {
                return reply();
            } else {
                var credentials = request.auth.credentials;
                credentials.token = tokens.token.access_token;
                credentials.expiry = tokens.token.expiry_date;

                request.cookieAuth.set(credentials);
                // setOauth2Credentials(oauth2Client, credentials);
                console.log('test1');
                return reply()

            }
        });
}

exports.register = function (server, options, next) {
    OAuth2 = google.auth.OAuth2;
    oauth2Client = new OAuth2(
        options.bell.clientId,
        options.bell.clientSecret
    );

    server.route([
        {
            method: 'GET',
            path: '/userVideos',
            config: {
                pre: [{
                    method: tokenVerified,
                    assign: 'tokenVerified'
                }],
                handler: function (request, reply) {
                    var service = google.youtube('v3');
                    service.activities.list({
                        auth: oauth2Client,
                        part: 'snippet,contentDetails',
                        mine: true
                    }, function (err, response) {
                        if (err) {
                            console.log('The API returned an error: ' + err)
                            return;
                        }
                        var channels = response.items;

                        reply(response);
                    });
                }
            }
        },
        {
            method: 'GET',
            path: '/captions',
            config: {
                pre: [{
                    method: tokenVerified,
                    assign: 'tokenVerified'
                }],
                handler: function (request, reply) {
                    var service = google.youtube('v3');
                    service.captions.list({
                        auth: oauth2Client,
                        part: 'snippet',
                        videoId: 'CCcjOgHqJRM'
                    }, function (err, response) {
                        if (err) {
                            console.log('The API returned an error: ' + err)
                            return;
                        }
                        var channels = response.items;

                        reply(response);
                    });
                }
            }
        },
        {
            method: 'GET',
            path: '/subtitle',
            config: {
                pre: [{
                    method: tokenVerified,
                    assign: 'tokenVerified'
                }],
                handler: function (request, reply) {
                    var service = google.youtube('v3');
                    service.captions.download({
                        auth: oauth2Client,
                        id: 'zMbMYMV7FRRhTSZCEMd2rjRuMBYBIs9VRFmy28pxOSw=',
                        tfmt: 'vtt'
                    }, function (err, response) {
                        if (err) {
                            console.log('The API returned an error: ' + err)
                            return;
                        }
                        var channels = response.items;
                        reply(response);
                        vttToJSON(response)
                            .then((result) => {
                                reply(result);
                            });
                    });
                }
            }
        },
        {
            method: 'GET',
            path: '/me',
            config: {
                pre: [{
                    method: tokenVerified,
                    assign: 'tokenVerified'
                }],
                handler: function (request, reply) {
                    var service = google.people('v1');
                    service.people.get({
                        auth: oauth2Client,
                        resourceName: 'people/me',
                        personFields: 'emailAddresses'
                    }, function (err, response) {
                        if (err) {
                            console.log('The API returned an error: ' + err)
                            return;
                        }

                        reply(response);
                    });
                }
            }
        },
        {
            method: 'GET',
            path: '/channels',
            config: {
                pre: [{
                    method: tokenVerified,
                    assign: 'tokenVerified'
                }],
                handler: function (request, reply) {
                    var service = google.youtube('v3');
                    service.channels.list({
                        auth: oauth2Client,
                        part: 'contentDetails',
                        mine: true
                    }, function (err, response) {
                        if (err) {
                            console.log('The API returned an error: ' + err)
                            return;
                        }

                        reply(response);
                    });
                }
            }
        },

    ]
    );
    next();
}

exports.register.attributes = {
    name: 'youtubeAPI'
}