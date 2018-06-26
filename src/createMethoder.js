//@flow

import camelToSnake from './utilities/camelToSnake';
import isObject from './utilities/isObject';
import mergeDeep from './utilities/mergeDeep';
import prefix from './prefix';
import reduxMethods from './reduxMethods';

type objectType = { [key: string]: any };
type methodsObject = { [key: string]: methodsObject | Function } | {};
type methodType = { path: string, payload: mixed, type: string };

/**
 * @description creates an object of identical structure to the state paramater, creating a Redux action creator for each method provided at every property in the object, then merges with additionalMethods (eg thunks/selectors/other action creators)
 * @export
 * @param {objectType} state the initial state object to serve as the structure
 * @param {objectType} methods the method functions to be applied at every level of the initial state tree
 * @param {...Array<objectType>} additionalMethods additional methods to be merged in with the methods.
 */

export default function createMethoder ( state: objectType,
                                         methods: objectType,
                                         ...additionalMethods: Array<objectType> ) {
  /**
   * @description takes an object, key and path argument to generate action creators for that path in the original sate object
   * @param {objectType} obj
   * @param {string} [key='']
   * @param {string} [path='']
   */

  function createMethodsFromActions ( obj: objectType, key: string = '', path: string = '' ) {
    const newPath: string = path ? `${path}.${key}` : key;

    if ( key ) {
      Object.keys( methods ).forEach( action => {
        /**
         * @description takes a payload paramater and returns an action type object with the properties path, payload, type
         * @param {mixed} payload
         * @returns {methodType}
         */

        const actionCreator = ( payload: mixed ): methodType => ( {
          path : newPath,
          payload,
          type : `${prefix}${camelToSnake( action )}`,
        } );

        const parts = newPath.includes( '.' ) ? newPath.split( '.' ) : [ newPath, ];

        /**
         * @description reducer function applied to a string path split in to parts to drill down in to the reduxMethods object at the given path, creating any properties which do not exist
         * @param {methodsObject} ob
         * @param {string} key
         * @param {number} ind
         * @param {Array<any>} arr
         * @returns {methodsObject}
         */

        const assignActionCreator = (
          ob: methodsObject, key: string, ind: number, arr: Array<any>
        ): methodsObject => {
          if ( !ob[key] ) ob[key] = {};
          if ( ind === arr.length - 1 ) ob[key][action] = actionCreator;
          return ob[key];
        };

        parts.reduce( assignActionCreator, reduxMethods );
      } );
    }
    if ( isObject( obj ) ) {
      Object.keys( obj ).forEach( ( newKey: string ) => {
        createMethodsFromActions( obj[newKey], newKey, newPath );
      } );
    }
  }

  createMethodsFromActions( state );

  /**
   * @description takes any number of arguments of methodTypes and returns an object with the keys payload (the array of methodTypes) and type containing TUTTI
   * @param {...Array<methodType>} payload
   * @returns {{ payload: Array<methodType>, type: string }}
   */

  const combinedActions = ( ...payload: Array<methodType> ): { payload: Array<methodType>, type: string } => ( {
    payload,
    type: `${prefix}TUTTI`,
  } );

  reduxMethods.tutti = combinedActions;

  reduxMethods.custom = Object.keys( methods ).reduce( ( custom: objectType, action: string ): {
    [key: string]: Function,
  } => {
    /**
     * @description takes a path and payload paramater and returns a methodType object with the properties path, payload and type
     * @param {string} path
     * @param {mixed} payload
     * @returns {methodType}
     */

    const actionCreator = ( path: string, payload: mixed ): methodType => ( {
      path,
      payload,
      type: `${prefix}${camelToSnake( action )}`,
    } );

    custom[action] = actionCreator;

    return custom;
  }, {} );

  mergeDeep( reduxMethods, ...additionalMethods );
}
