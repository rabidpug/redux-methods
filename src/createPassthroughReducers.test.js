import createPassthroughReducers from './createPassthroughReducers';

describe( 'createPassthroughReducers function', () => {
  const obj = {
    key1 : 'this',
    key2 : 'that',
  };

  it( 'Should return an object with matching properties', () => {
    const result = Object.keys( obj );

    expect( Object.keys( createPassthroughReducers( obj ) ) ).toEqual( result );
  } );

  describe( 'createPassthroughReducers return value', () => {
    Object.entries( obj ).forEach( ( [
      key,
      result,
    ] ) => {
      it( 'Should contain a function at each given key which returns the value of that key in the original object when no paramater is passed', () => {
        expect( createPassthroughReducers( obj )[key]() ).toEqual( result );
      } );

      it( 'Should contain a function at each given key which returns the value of the paramater passed when a paramater is passed', () => {
        const result = 'hello';

        expect( createPassthroughReducers( obj )[key]( result ) ).toEqual( result );
      } );
    } );
  } );
} );
