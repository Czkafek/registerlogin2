const { sign } = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const createAccessToken  = userId => {
    return sign({ userId }, fs.readFileSync(path.join(__dirname, '../priv.pem'), 'utf-8'), {
        algorithm: 'RS256',
        expiresIn: '2m' // W celach testowych
    });
}

const createRefreshToken = userId => {
    return sign({ userId }, fs.readFileSync(path.join(__dirname, '../priv.pem'), 'utf-8'), {
        algorithm: 'RS256',
        expiresIn: '15m' // W celach testowych
    });
}

module.exports = { createAccessToken, createRefreshToken };