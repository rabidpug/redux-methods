import mergeDeep from './mergeDeep';

describe( 'mergeDeep function', () => {
  const obj1 = {
    key1 : { part1: 'this', },
    key2 : 'that',
  };
  const obj2 = {
    key1 : { part2: 'them', },
    key3 : {
      part1 : 'thise',
      part4 : [ 'ho!', ],
    },
  };
  const obj3 = { key3: { part4: [ 'ha!', ], }, };
  const obj4 = 'lol';

  it( 'Should return a deeply merged object when passed 2 or more objects', () => {
    const result = {
      key1: {
        part1 : 'this',
        part2 : 'them',
      },
      key2 : 'that',
      key3 : {
        part1 : 'thise',
        part4 : [ 'ha!', ],
      },
    };

    expect( mergeDeep(
      obj1, obj2, obj3, obj4
    ) ).toEqual( result );
  } );
} );
