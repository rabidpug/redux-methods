import isObject from './isObject';

describe( 'isObject function', () => {
  it( 'Should correctly respond true when passed an object with contents', () => {
    const item = {
      anObject : 'i am',
      yes      : true,
    };
    const result = true;

    expect( isObject( item ) ).toEqual( result );
  } );

  it( 'Should correctly respond true when passed an object without contents', () => {
    const item = {};
    const result = true;

    expect( isObject( item ) ).toEqual( result );
  } );

  it( 'Should correctly respond false when passed a number type', () => {
    const type = 1;
    const result = false;

    expect( isObject( type ) ).toEqual( result );
  } );

  it( 'Should correctly respond false when passed a string type', () => {
    const type = 'string';
    const result = false;

    expect( isObject( type ) ).toEqual( result );
  } );

  it( 'Should correctly respond false when passed a null type', () => {
    const type = null;
    const result = false;

    expect( isObject( type ) ).toEqual( result );
  } );

  it( 'Should correctly respond false when passed an undefined type', () => {
    const type = undefined; //eslint-disable-line
    const result = false;

    expect( isObject( type ) ).toEqual( result );
  } );

  it( 'Should correctly respond false when passed an array type', () => {
    const type = [];
    const result = false;

    expect( isObject( type ) ).toEqual( result );
  } );

  it( 'Should correctly respond false when passed a boolean type', () => {
    const type = true;
    const result = false;

    expect( isObject( type ) ).toEqual( result );
  } );
} );
