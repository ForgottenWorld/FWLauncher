const path = require('path');
const fs = require('fs');

module.exports = {
    webpack: {
        configure: {
            target: 'electron-renderer'
        }
    }
};