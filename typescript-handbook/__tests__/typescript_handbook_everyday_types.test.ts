describe('TypeScript Handbook EveryDay Types', function () {
  let results, expected;
  describe('Type annotations for string, number, and boolean', function () {
    // note for literal primitive assignments Typescript can easily infer the type
    // we could use const myString: string = 'Alice'; const myNumber: number = 34;
    // const myBoolean: boolean = true;
    it('string annotation', function () {
      const myString = 'Alice';
      expect(myString).toBe('Alice');
    });

    it('number annotation', function () {
      const myNumber = 34;
      expect(myNumber).toBe(34);
    });

    it('boolean annotation', function() {
      const myBoolean = true;
      expect(myBoolean).toBe(true);
    });
  });

  describe('Array annotations for string, number, and boolean', function () {
    it('string annotation', function () {
      const myStringAry: string[] = ['foo', 'bar', 'fizz', 'buzz'];
      expect(myStringAry).toEqual(['foo', 'bar', 'fizz', 'buzz']);
    });

    it('number annotation ', function () {
      const myNumberAry: number[] = [0, 1, 2, 3];
      expect(myNumberAry).toEqual([0, 1, 2, 3]);
    });

    it('boolean annotation ', function () {
      const myBooleanAry: boolean[] = [true, false, true, false];
      expect(myBooleanAry).toEqual([true, false, true, false]);
    });
  });

  describe('any annotation', function () {
    let obj: any
    beforeEach(() => {
      obj = { x: 0 }
    });

    it('any type circumvents type checking errors', function () {
      expect(obj.x).toBe(0);
    });

    it('safe to assign new properties to any type', function () {
      obj.y = 'foo';
      expect(obj.y).toBe('foo');
    });

    it('safe to call non-existent properties', function () {
      expect(obj.z).toBeUndefined();
    });
  });

  describe('Function Type Annotations', function () {
    it('parameter annotations', function () {
      function greet(name: string) {
        return `Hello, ${name.toUpperCase()}!!`
      }
      expect(greet('foo')).toBe('Hello, FOO!!');
    });

    it('return type annotations', function () {
      function favoriteNumber(): number { return 13; }
      expect(favoriteNumber()).toBe(13);
    });

    it('typescript can many times infer a return type', function () {
      const stringReturn = (text: string) => text;
      expect(stringReturn('FooBar')).toBe('FooBar');
    });

    it('typescript infers the arguments for anonymous functions', function () {
      const ary = ['foo', 'bar'];
      const expected = ['FOO', 'BAR'];
      const results: string[] = [];

      ary.forEach(s => results.push(s.toUpperCase())) // based on inferred type from the array, no need
      // to declare type in the anonymous forEach function
      expect(results).toEqual(expected);
    });
  });

  describe('Object Type Annotations', function () {
    it('object type function parameter notation', function () {
      function pointCoordinate(point: { x: number, y: number }) {
        return [point.x, point.y];
      }
      expect(pointCoordinate({ x: 1, y: 2 })).toEqual([1, 2])
    });

    it('object types allow optional properties', function () {
      function returnName(name: { first: string, last?: string }) {
        return name.last ? `${name.first} ${name.last}` : `${name.first}`;
        // because of the nature of optional properties you must check for its
        // existence before using the property.  This is called narrowing.
      }
      results = [returnName({ first: 'Elmer' }), returnName({ first: 'Elmer', last: 'Fudd' })];
      expected = ['Elmer', 'Elmer Fudd'];
      expect(results).toEqual(expected);
    });

    it('object types can be extended via intersections', function() {
      type Animal = {
        name: string;
      }

      type Bear = Animal & {
        honey: boolean;
      }

      const smokey: Bear = { name: "Smokey Bear", honey: false};
      expected = ["Smokey Bear", false];
      results = [smokey.name, smokey.honey];
      expect(results).toEqual(expected);
    });
  });

  describe('Union Types', function () {
    it('allow for more than one type on a variable', function () {
      function returnIdType(id: string | number) {
        if (typeof id === 'number') {
          return 'ID was a number.'
        } else {
          return 'ID was a string.'
        }
      }
      expected = ['ID was a number.', 'ID was a string.'];
      results = [returnIdType(4), returnIdType('5')];
      expect(results).toEqual(expected);
    });

    it('typescript only supports operations valid for every member of the union', function () {
      function checkUnionType(id: string | number) {
        if (typeof id === 'string') {
          return id.toUpperCase();
        } else {
          return id;
        }
      }
      expect(checkUnionType('foo')).toBe('FOO');
    });

    it('union types may require narrowing', function () {
      function welcomePeople(group: string[] | string) {
        if (Array.isArray(group)) {
          return `Welcome ${group.join(', ')}.`
        } else {
          return `Welcome ${group}.`
        }
      }
      // if it is not an array of strings then it must be a string, also called narrowing the union
      expected = ['Welcome Elmer, Daffy, Bugs.', 'Welcome Yosemite.']
      results = [welcomePeople(['Elmer', 'Daffy', 'Bugs']), welcomePeople('Yosemite')];
      expect(results).toEqual(expected);
    });

    it('common methods for types can be called without narrowing', function () {
      function getThreeWithOffset(offset: number, x: number[] | string) {
        return x.slice(offset, offset + 3);
      }
      const numberAry = [0, 1, 2, 3, 4, 5];
      const str = "abcdef";
      const expectedNumberAry = [1, 2, 3];
      const expectedStr = "bcd";
      const resultNumberAry = getThreeWithOffset(1, numberAry);
      const resultStr = getThreeWithOffset(1, str);

      expect([resultNumberAry, resultStr]).toEqual([expectedNumberAry, expectedStr]);
    });
  });

  describe('Type Aliases', function () {
    it('enable object type reuse', function () {
      type Point = { x: number, y: number }; // declare a type of type Point
      function getCoordinates(p: Point) {
        return p;
      }
      expect(getCoordinates({x: 1, y: 2})).toEqual({ x: 1, y: 2 });
    });

    it('using aliases is the same as using the aliased type', function () {
      type aliasString = string;
      function getString( x: string): aliasString {
        return (x);
      }
      expected = ['foo', 'bar'];
      let y = getString('foo');
      results = [y];
      y = 'bar'; // can reassign y because aliasString is just a string
      results.push(y);
      expect(results).toEqual(expected);
    });

    it('a type alias can be extended through intersections', function () {
      /*
        Note a type, once declared cannot be changed after it is created, so we cannot do something like:
        type Animal = { name: string };
        type Animal = { weight: number }; // here we attempt to add a property to an existing Animal type
        // and we would encounter a TypeScript compile error, claiming a duplicate Animal type
      */
      type Animal = { name: string };
      type Bear = Animal & { likes_honey: boolean };
      function getBear(): Bear {
        return { name: 'Smokey', likes_honey: true };
      }
      expected = { name: 'Smokey', likes_honey: true };
      expect(getBear()).toEqual(expected);
    });
  });

  describe('Interfaces', function () {
    it('an interface declaration is another way to declare an object type', function () {
      interface Point { x: number, y: number }
      function getCoordinate(p: Point) {
        return [p.x, p.y];
      }
      expect(getCoordinate({ x: 1, y: 2 })).toEqual([1, 2]);
    });

    it('interfaces can have new fields added to them after declaration', function () {
      interface Animal { name: string }
      interface Animal { species: string }
      function getAnimal(): Animal {
        return { name: 'wolf', species: 'Canine' };
      }
      expected = { name: 'wolf', species: 'Canine' };
      expect(getAnimal()).toEqual(expected);
    });

    it('new interfaces can be created by extending current interfaces', function () {
      interface Gun { name: string }
      interface Pistol extends Gun { caliber: number }
      const magnum44: Pistol = { name: 'Magnum', caliber: 0.44 };
      expect([magnum44.name, magnum44.caliber]).toEqual(['Magnum', 0.44]);
    });
  });

  describe('Literal Types', function () {
    it('particularly useful with union', function () {
      function alignedString(s: string, alignment: 'left' | 'right') {
        return alignment === 'left' ? s.padEnd(10) : s.padStart(10);
      }
      expect(alignedString('foo', 'right')).toBe('       foo');
    });

    it('can be combined with non-literal types', function () {
      interface Options {
        width: number;
      }
      function configure(x: Options | "auto") {
        return x === 'auto' ? NaN : x.width;
      }
      expect(configure({ width: 5 })).toBe(5);
    });


    it('can union literal return types', function () {
      const compareStrings = (a: string, b: string): -1 | 0 | 1  => {
        return a === b ? 0 : a > b ? 1 : -1;
      }
      expect(compareStrings("foo", "bar")).toBe(1);
    });
  });

  describe('strictNullChecks on', function () {
    it('advised to be default setting, so null or undefined do not pass through', function () {
      function liveDangerously(x: number | null) {
        return x === null ? 'null argument' : x;
      }
      expect(liveDangerously(5)).toBe(5);
    });

    it('can use typescript shorthand for null or undefined checks', function () {
      function liveDangerously(x?: number | null) {
        return x!.toFixed(2); // the ! ensures x is not a null or undefined value
      }
      expect(liveDangerously(3.56)).toBe('3.56');
    });
  });
});
