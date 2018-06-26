import camelToSnake from './camelToSnake';

describe( 'camelToSnake function', () => {
  it( 'Should convert a string in camelCase to SNAKE_CASE', () => {
    const before = 'camelCase';
    const after = 'CAMEL_CASE';

    expect( camelToSnake( before ) ).toEqual( after );
  } );

  it( 'Should convert a single word string to CAPITALS', () => {
    const before = 'single';
    const after = 'SINGLE';

    expect( camelToSnake( before ) ).toEqual( after );
  } );

  it( 'Should leave a string in SNAKE_CASE as-is', () => {
    const noChange = 'SNAKE_CASE';

    expect( camelToSnake( noChange ) ).toEqual( noChange );
  } );

  it( 'Should leave a string in dot.notation as-is', () => {
    const noChange = 'dot.notated';

    expect( camelToSnake( noChange ) ).toEqual( noChange );
  } );

  it( 'Should leave a string in PascalCase as-is', () => {
    const noChange = 'PascalCase';

    expect( camelToSnake( noChange ) ).toEqual( noChange );
  } );

  it( 'Should leave a non-string as-is', () => {
    const noChange = [ 'lol', ];

    expect( camelToSnake( noChange ) ).toEqual( noChange );
  } );
} );
