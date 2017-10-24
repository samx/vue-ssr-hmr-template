const opts = {
    error: (error, e) => {
        if (e.cn) {
            // A connection-related error;
            //
            // Connections are reported back with the password hashed,
            // for safe errors logging, without exposing passwords.
            console.log('CN:', e.cn);
            console.log('EVENT:', error.message || error);
        }
    }
}
const pgp = require('pg-promise')();
exports.register = function (server, options, next) {

    const cn = {
        host: 'localhost',
        port: 5432,
        database: 'hotkeys_dev',
        user: 'postgres',
        password: 'postgres'
    };
    const db = pgp(cn);

    server.app.db = db;

    next();
}

exports.register.attributes = {
    name: 'postgresDB'
}