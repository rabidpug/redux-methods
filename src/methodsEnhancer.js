//@flow

import createMethoder from './createMethoder';
import prefix from './prefix';
import snakeToCamel from './utilities/snakeToCamel';

type methodsType = { [key: string]: Function };
type stateType = { [key: string]: any };
type actionType = {
  type: ?string,
  payload: ?any,
  path: ?string,
};
type reducerType = ( state: stateType, action: actionType ) => stateType;
type createStoreType = ( reducer: reducerType, initialState: stateType, enhancer: ?Function ) => {};

/**
 * @description redux Enhancer that receives methods and additionalMethods to generate method action creators and method reducer. finally returns a Redux Store object
 * @param {methodsType} methods
 * @param {...Array<methodsType>} additionalMethods
 * @returns {( createStore: createStoreType ) => ( reducer: reducerType, initialState: stateType, enhancer: ?Function ) => {}}
 */

export default function methodsEnhancer ( methods: methodsType,
                                          ...additionalMethods: Array<methodsType> ): ( createStore: createStoreType ) => ( reducer: reducerType, initialState: stateType, enhancer: ?Function ) => {} {
  return function enhance ( createStore ) {
    return function combine ( reducer, initialState, enhancer ) {
      createMethoder( initialState, methods, ...additionalMethods );

      /**
       * @description receives state and action, returns new state or original if no action taken, or return of next reducer if not a relevant action
       * @param {stateType} [state=initialState]
       * @param {actionType} action
       * @returns {stateType}
       */

      function methodsReducer ( state: stateType = initialState, action: actionType ): stateType {
        if ( action && typeof action === 'object' && action.type && action.type.includes( prefix ) ) {
          const actions =
            action.type === `${prefix}TUTTI` && Array.isArray( action.payload )
              ? action.payload.filter( ( payload: actionType ) => payload.type && payload.path )
              : [ action, ];
          let data = state;

          /**
           * @description reduces down to a reference to a slice of state
           * @param {stateType} p
           * @param {string} n
           * @returns {stateType}
           */

          const getStateRef = ( stateObject: stateType, nextPath: string ): stateType =>
            stateObject ? stateObject[nextPath] : {};

          /**
           * @description reduces down the state to update a value immutably without breaking other references
           * @param {mixed} payload
           * @param {string} method
           * @param {Array<string>} parts
           */

          const mergeChange = ( payload: mixed, method: string, parts: Array<string> ) => (
            p: stateType,
            n: string,
            i: number,
            a: Array<string>
          ): stateType => {
            if ( i === 0 ) {
              data = {
                ...data,
                [n]:
                  i < a.length - 1
                    ? { ...parts.slice( 0, i + 1 ).reduce( getStateRef, data ), }
                    : methods[method]( payload, data[n], parts.reduce( getStateRef, initialState ) ),
              };

              return data;
            } else {
              p[a[i - 1]] = {
                ...p[a[i - 1]],
                [n]:
                  i < a.length - 1
                    ? { ...parts.slice( 0, i + 1 ).reduce( getStateRef, data ), }
                    : methods[method]( payload, p[a[i - 1]][n], parts.reduce( getStateRef, initialState ) ),
              };

              return p[a[i - 1]];
            }
          };

          for ( const act of actions ) {
            const { type, payload, path, }: actionType = act;

            if ( typeof type === 'string' && typeof path === 'string' ) {
              const method = snakeToCamel( type.replace( prefix, '' ) );
              const parts = path.includes( '.' ) ? path.split( '.' ) : [ path, ];

              parts.reduce( mergeChange( payload, method, parts ), {} );
            }
          }

          return data;
        } else return reducer( state, action );
      }

      return createStore( methodsReducer, initialState, enhancer );
    };
  };
}
