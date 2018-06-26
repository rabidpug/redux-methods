import createMethoder from './createMethoder';
import prefix from './prefix';
import reduxMethods from './reduxMethods';

describe( 'createMethoder function', () => {
  const initialState = {
    path1 : { subpath1: { subsubpath1: 'hi', }, },
    path2 : [],
  };
  const methods = {
    add    : payload => payload,
    remove : () => null,
  };

  createMethoder( initialState, methods );

  it( 'should modify reduxMethods to contain the same properties, as well as "custom" and "tutti" at the root level', () => {
    const result = [
      'path1',
      'path2',
      'custom',
      'tutti',
    ].sort();

    expect( Object.keys( reduxMethods ).sort() ).toEqual( result );
  } );

  it( 'should modify reduxMethods to contain the methods provided as keys at each property and sub-property, preserving sub-properties', () => {
    const result = [
      'add',
      'remove',
      'subpath1',
    ].sort();

    expect( Object.keys( reduxMethods.path1 ).sort() ).toEqual( result );
  } );

  it( 'should modify reduxMethods to return an action type object when accessing a method property', () => {
    const payload = 'hi';
    const result = {
      path : 'path1',
      payload,
      type : `${prefix}ADD`,
    };

    expect( reduxMethods.path1.add( payload ) ).toEqual( result );
  } );

  it( 'should modify reduxMethods to return an action type of tutti when accessing the tutti method property', () => {
    const payload = [
      {
        path    : 'path1',
        payload : 'hi',
        type    : `${prefix}ADD`,
      },
    ];
    const result = {
      payload,
      type: `${prefix}TUTTI`,
    };

    expect( reduxMethods.tutti( reduxMethods.path1.add( 'hi' ) ) ).toEqual( result );
  } );

  it( 'should modify reduxMethods to return an action type of with a custom path when accessing the custom method property', () => {
    const path = 'path1.test';
    const payload = 'hi';
    const result = {
      path,
      payload,
      type: `${prefix}ADD`,
    };

    expect( reduxMethods.custom.add( path, payload ) ).toEqual( result );
  } );
} );
