//@flow

import createMethoder from './createMethoder';
import mergeDeep from './utilities/mergeDeep';
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
          const newState = mergeDeep( {}, state );

          for ( const act of actions ) {
            const { type, payload, path, }: actionType = act;

            if ( typeof type === 'string' && typeof path === 'string' ) {
              const method = snakeToCamel( type.replace( prefix, '' ) );
              let data = newState;
              let initial = initialState;
              const parts = path.includes( '.' ) ? path.split( '.' ) : [ path, ];

              for ( let i = 0; i < parts.length; i++ ) {
                const part = parts[i];

                if ( initial ) initial = initial[part];

                if ( i === parts.length - 1 ) data[part] = methods[method]( payload, data[part], initial );
                else if ( data[part] ) data = data[part];
                else {
                  data[part] = {};

                  data = data[part];
                }
              }
            }
          }

          return newState;
        } else return reducer( state, action );
      }

      return createStore( methodsReducer, initialState, enhancer );
    };
  };
}
