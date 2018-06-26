//@flow

type stateType = {
  [key: string]: mixed,
};

/**
 * @description Takes the given object's properties and returns an object with those
 properties mapped to a passthrough reducer function.
 * @param {{}} initialState
 * @returns {{}} returns an array of functions that return the first paramater
 */

export default function createPassthroughReducers ( initialState: stateType ): { [key: string]: Function } {
  return Object.keys( initialState ).reduce( ( p: {}, n: string ) => {
    p[n] = ( state: mixed = initialState[n] ): mixed => state;

    return p;
  }, {} );
}
