"use strict";

/**
 * @module Config
 */

/**
 * Retrieve sources from configuration files.
 *
 * @param {module:Spring~ConfigData} data - spring response data.
 * @return {Array<module:Spring~ConfigSource>} list of sources.
 */
function getSources(data) {
  return data.propertySources.map((file) => file.source);
}

/**
 * Configuration handler
 * @class
 */
class Config {
  /**
   * Function to apply to every property in configuration
   *
   * @callback forEachFunc
   * @param {string} key - property key
   * @param {*} value - property value
   */

  /**
   * Create config object.
   *
   * @param {module:Spring~ConfigData} data - spring response data
   */
  constructor(data) {
    this._raw = data;
    this._properties = getSources(this._raw).reduce((accum, value) => Object.assign({}, value, accum), {});
  }

  /**
   * Computed configuration properties
   *
   * @public
   * @type {module:Spring~ConfigSource}
   */
  get properties() {
    return Object.assign({}, this._properties);
  }


  /**
   * Raw spring response data
   *
   * @public
   * @type {module:Spring~ConfigData}
   */
  get raw() {
    return Object.assign({}, this._raw);
  }

  /**
   * Retrieve a configuration property by key
   *
   * @public
   * @param {...string} keyParts - parts to join as key
   * @return {*} property value
   */
  get(keyParts) {
    const key = [].slice.call(arguments).filter(String).join('.');

    return this._properties[key];
  }

  /**
   * Iterate over configuration properties
   *
   * @public
   * @param {module:Config~forEachFunc} callback - function to apply to every property
   * @param {boolean} [includeOverridden=false] whether to include overridden properties
   */
  forEach(callback, includeOverridden) {
    const _include = includeOverridden || false;
    const sources = _include ? getSources(this._raw) : [this._properties];

    sources.forEach((source) => {
      for (let prop in source ) {
        if (source.hasOwnProperty(prop)) {
          callback(prop, source[prop]);
        }
      }
    });
  }

  /**
   * Returns a string representation of raw response data
   *
   * @public
   * @param {number} spaces - number spaces to use in formatting
   * @returns {string} - raw response data as string
   */
  toString(spaces) {
    return JSON.stringify(this._raw, null, spaces);
  }
}

module.exports = Config;
