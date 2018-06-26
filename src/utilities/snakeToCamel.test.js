import snakeToCamel from './snakeToCamel';

describe( 'snakeToCamel function', () => {
  it( 'Should convert a string in SNAKE_CASE to camelCase', () => {
    const before = 'SNAKE_CASE';
    const after = 'snakeCase';

    expect( snakeToCamel( before ) ).toEqual( after );
  } );

  it( 'Should convert a single word string to lowercase', () => {
    const before = 'SINGLE';
    const after = 'single';

    expect( snakeToCamel( before ) ).toEqual( after );
  } );

  it( 'Should leave a string in camelCase as-is', () => {
    const noChange = 'camelCase';

    expect( snakeToCamel( noChange ) ).toEqual( noChange );
  } );

  it( 'Should leave a string in dot.notation as-is', () => {
    const noChange = 'dot.notated';

    expect( snakeToCamel( noChange ) ).toEqual( noChange );
  } );

  it( 'Should leave a string in PascalCase as-is', () => {
    const noChange = 'PascalCase';

    expect( snakeToCamel( noChange ) ).toEqual( noChange );
  } );

  it( 'Should leave a non-string as-is', () => {
    const noChange = [ 'lol', ];

    expect( snakeToCamel( noChange ) ).toEqual( noChange );
  } );
} );
