let defaultt = 'dev';
if (process.env.NODE_ENV) {
    defaultt = process.env.NODE_ENV;
}
console.info(`[LOADING API ON ${defaultt} CONF.]`);
require('dotenv').config({
    path: `env.${defaultt}`
});