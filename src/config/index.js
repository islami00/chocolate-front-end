import configCommon from './common.json';
// Using `require` as `import` does not support dynamic loading (yet).
/** @type {import("./development.json") & import("./production.json") & import("./test.json")} */
const configEnv = require(`./${process.env.NODE_ENV}.json`);
const types = require('./types.json');

/** 
 * @typedef {typeof configEnv } ConfigEnv
 * @typedef {typeof configCommon} ConfigCommon
 * @type {{types: typeof types;} & ConfigCommon & ConfigEnv}
 */
const config = { ...configCommon, ...configEnv, types };
export default config;
