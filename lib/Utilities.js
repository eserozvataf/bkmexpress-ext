// dependencies
var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    moment = require('moment'),
    debug = require('debug')('bkmexpress'),
    ursa = require('ursa');

function inspect(tag, obj) {
    debug(tag, util.inspect(obj, { colors: true, depth: 10 }));
}

function ReadCertificate(file) {
    return fs.readFileSync(file, { encoding: 'utf8' });
}

function Sign(data, key) {
    var openssl = ursa.coerceKey(key);
    try {
        return openssl.hashAndSign('sha256', data, 'utf8', 'base64');
    }
    catch (e) {
        inspect('Sign Error', e);
        return false;
    }
}

function Verify(bkmKey, hashed, dataToVerify) {
    // NOTE: Ursa not reading public key from a certificate so, i export public key with openssl x509 -pubkey -noout -in  bkm.pub > bkm.pem
    var signature = bkmKey || ReadCertificate(path.normalize(__dirname + '/../bkm_static/bkm.pem'));
    var openssl = ursa.coerceKey(signature);
    var hashedSalt = new Buffer(hashed, 'base64');

    try {
        return openssl.hashAndVerify('sha256', dataToVerify, hashedSalt);
    }
    catch (e) {
        inspect('Verify Error', e);
        return false;
    }
}

function CalcTimeDiff(ts, diff) {
    diff = diff || 60;
    ts = new moment(ts, 'YYYYMMDD-HH:mm:ss').unix();

    var now = new moment().unix();

    return ts > (now - diff) && ts < (now + diff);
}

function GetTimestamp() {
    return new moment().format('YYYYMMDD-HH:mm:ss');
}

module.exports = {
    inspect: inspect,
    ReadCertificate: ReadCertificate,
    Sign: Sign,
    Verify: Verify,
    CalcTimeDiff: CalcTimeDiff,
    GetTimestamp: GetTimestamp
};
