// @flow

/**
 * @description converts a given snake case formatted string to camel case format
 * @param {string} string
 * @returns {string}
 */

export default function snakeToCamel ( string: string ): string {
  return typeof string === 'string' && string.match( /^[A-Z]{1,}(_|[A-Z]){0,}$/ )
    ? string.toLowerCase().replace( /_([a-z])/g, g => g[1].toUpperCase() )
    : string;
}
