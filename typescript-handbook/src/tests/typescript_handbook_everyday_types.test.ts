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
      function favoriteNumber(): number {
        return 13;
      }
      expect(favoriteNumber()).toBe(13);
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
      }
      results = [returnName({ first: 'Elmer' }), returnName({ first: 'Elmer', last: 'Fudd' })];
      expected = ['Elmer', 'Elmer Fudd'];
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

    it('union types may require narrowing', function () {
      function welcomePeople(group: string[] | string) {
        if (Array.isArray(group)) {
          return `Welcome ${group.join(', ')}.`
        } else {
          return `Welcome ${group}.`
        }
      }
      expected = ['Welcome Elmer, Daffy, Bugs.', 'Welcome Yosemite.']
      results = [welcomePeople(['Elmer', 'Daffy', 'Bugs']), welcomePeople('Yosemite')];
      expect(results).toEqual(expected);
    });
  });

  describe('Type Aliases', function () {
    it('enable object type reuse', function () {
      type Point = { x: number, y: number }; // declare a type of type Point
      function getCoordinates(p: Point) {
        return [p.x, p.y];
      }
      expect(getCoordinates({x: 1, y: 2})).toEqual([1, 2])
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
    it('an interface declaration is another way to declear an object type', function () {
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
        return x!.toFixed(2);
      }
      expect(liveDangerously(3.56)).toBe('3.56');
    });
  });
});
