import methodsEnhancer from './methodsEnhancer';
import prefix from './prefix';

describe( 'methodsEnhancer function', () => {
  const createStoreMock = ( ...args ) => args;
  const initialState = {
    path1 : { subpath1: { subsubpath1: 'hi', }, },
    path2 : [],
  };
  const initialEnhancer = null;
  const reducer = jest.fn();
  const methods = {
    add    : payload => payload,
    remove : () => null,
  };
  const thunks = { doThing: jest.fn(), };
  const selectors = { getThing: jest.fn(), };
  const [
    methodReducer,
    state,
    enhancer,
  ] = methodsEnhancer( methods, thunks, selectors )( createStoreMock )( reducer,
                                                                        initialState,
                                                                        initialEnhancer );

  it( 'should return a methodReducer function', () => {
    expect( typeof methodReducer ).toEqual( 'function' );
  } );

  it( 'should return the initial state', () => {
    expect( state ).toEqual( initialState );
  } );

  it( 'should return the enhancer', () => {
    expect( enhancer ).toEqual( initialEnhancer );
  } );

  describe( 'methodReducer function', () => {
    it( 'Should call the reducer function with state and action if the action is not relevant', () => {
      const action = {
        payload : 'hi!',
        type    : 'SOME_TYPE',
      };

      methodReducer( initialState, action );

      expect( reducer ).toBeCalledWith( initialState, action );
    } );

    it( 'Should call the reducer function with the initial state when the state provided is null', () => {
      methodReducer();

      expect(reducer).toBeCalledWith(initialState, undefined); //eslint-disable-line
    } );

    it( 'Should return the unmodified state if called with an invalid path type', () => {
      const action = {
        path    : 123,
        payload : 'hey!',
        type    : `${prefix}ADD`,
      };

      expect( methodReducer( initialState, action ) ).toEqual( initialState );
    } );

    it( 'Should return the new state if called with a relevant action', () => {
      const action = {
        path    : 'path1.subpath1.subsubpath1',
        payload : 'hey!',
        type    : `${prefix}ADD`,
      };
      const result = {
        ...initialState,
        ...{ path1: { subpath1: { subsubpath1: action.payload, }, }, },
      };

      expect( methodReducer( initialState, action ) ).toEqual( result );
    } );

    it( 'Should return the new state with all modifications if called with a tutti action', () => {
      const action1 = {
        path    : 'path1.subpath1.subsubpath1',
        payload : 'holla!',
        type    : `${prefix}ADD`,
      };
      const action2 = {
        path : 'path2',
        type : `${prefix}REMOVE`,
      };
      const action = {
        payload: [
          action1,
          action2,
        ],
        type: `${prefix}TUTTI`,
      };
      const result = {
        path1 : { subpath1: { subsubpath1: action1.payload, }, },
        path2 : null,
      };

      expect( methodReducer( initialState, action ) ).toEqual( expect.objectContaining( result ) );
    } );

    it( 'Should return the new state with a new path created if it did not exist when called with a custom action', () => {
      const action = {
        path    : 'path1.subpath2.subsubpath1',
        payload : 'hehe',
        type    : `${prefix}ADD`,
      };
      const result = {
        path1: {
          subpath1 : initialState.path1.subpath1,
          subpath2 : { subsubpath1: action.payload, },
        },
      };

      expect( methodReducer( initialState, action ) ).toEqual( expect.objectContaining( result ) );
    } );
  } );
} );
