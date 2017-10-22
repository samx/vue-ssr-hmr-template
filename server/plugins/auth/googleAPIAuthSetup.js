var pub = {};
var internals = {};
internals.hasTokenExpired = function (expiry_date) {
    if (expiry_date === undefined) {
        expiry_date = 0;
    }
    console.log('expiry_date', expiry_date);
    console.log((new Date()).getTime() > expiry_date)
    return (new Date()).getTime() > expiry_date;
}
internals.setOauth2Credentials = function (oauth2, credentials) {
    oauth2.setCredentials({
        access_token: credentials.token,
        refresh_token: credentials.refreshToken
    });
}


pub.getNewTokensIfExpired = function (oauth2, credentials) {
    return new Promise(function (resolve, reject) {
        console.log('credentials', credentials);
        internals.setOauth2Credentials(oauth2, credentials);
        if (!internals.hasTokenExpired(credentials.expiry)) {
            resolve({ expired: false });
        } else {
            oauth2.refreshAccessToken(function (err, tokens) {
                console.log('new token', tokens);
                resolve({ expired: true, token: tokens });
            });
        }
    });
}


module.exports = pub;