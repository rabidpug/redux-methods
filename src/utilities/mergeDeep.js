//@flow

import isObject from './isObject';

type obj = { [key: string]: any };

/**
 * @description deeply merges given sources in to target object
 * @param {obj} target
 * @param {...Array<obj>} sources
 * @returns {obj}
 */

export default function mergeDeep ( target: obj, ...sources: Array<obj> ): obj {
  if ( !sources.length ) return target;
  const source = sources.shift();

  if ( isObject( target ) && isObject( source ) ) {
    for ( const key in source ) {
      if ( isObject( source[key] ) ) {
        if ( !target[key] ) Object.assign( target, { [key]: {}, } );

        mergeDeep( target[key], source[key] );
      } else Object.assign( target, { [key]: source[key], } );
    }
  }

  return mergeDeep( target, ...sources );
}
