//@flow

/**
 * @description converts a given camel case formatted string to snake case format
 * @param {string} string
 * @returns {string}
 */

export default function camelToSnake ( string: string ): string {
  if ( typeof string !== 'string' || !string.match( /^[a-z]{1,}[a-zA-Z]{1,}$/ ) ) return string;
  const upperChars: ?Array<string> = string.match( /([A-Z])/g );

  if ( !upperChars ) return string.toUpperCase();

  for ( let i = 0, n = upperChars.length; i < n; i++ ) string = string.replace( new RegExp( upperChars[i] ), `_${upperChars[i]}` );

  return string.toUpperCase();
}
