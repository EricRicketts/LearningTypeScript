describe('TypeScript Handbook Narrowing', function () {
  let results, expected;

  describe('Basic Narrowing Examples', function () {
    it('Narrowing is made possible by type guards', function () {
      const padLeft = (padding: number | string, input: string): string => {
        // we need the type guard below because number | string cannot be assigned to number which wold be the
        // case if we just returned " ".repeat(padding) + input, as repeat assumes its argument is a number
        if (typeof padding === 'number') {
          return " ".repeat(padding) + input;
        } else {
          return padding + " " + input;
        }
      }
      expected = ["   foo", "bar foo"];
      results = [padLeft(3, "foo"), padLeft("bar", "foo")];
      expect(results).toEqual(expected);
    });

    it('Narrowing taking into account null', function () {
      function returnAll(strs: string | string[] | null) {
        // we need the strs && typeof strs === 'object' because if we just did typeof strs === 'object' then
        // we would only be narrowed to string | null
        if (strs && typeof strs === 'object') {
          return strs.join(' ');
        } else {
          return strs;
        }
      }
      expect(returnAll(['foo', 'bar'])).toBe('foo bar');
    });
  });

  describe('Truthiness and Equality Narrowing', function () {
    it('simple truthiness narrowing', function () {
      const getUsersOnlineMessage = (numberUsersOnline?: number): string => {
        // we can use truthiness narrowing in this case to check if the parameter exists
        // then based on its existence or non-existence branch accordingly
        const numberOfUsersExist = !!numberUsersOnline;
        if (numberOfUsersExist) {
          return `There are ${numberUsersOnline} users online now.`;
        } else {
          return "Nobody's there.  :(";
        }
      }
      expected = ['There are 5 users online now.', 'Nobody\'s there.  :('];
      results = [getUsersOnlineMessage(5), getUsersOnlineMessage()];
    });
    it('simple equality narrowing', function () {
      function equalityNarrowingExample(x: string | number, y: string | boolean) {
        if (x === y) { // in this case x === y only if both are strings
          return [x.toUpperCase(), y.toLowerCase()];
        } else {
          return [x, y];
        }
      }
      expect(equalityNarrowingExample('foo', 'foo')).toEqual(['FOO', 'foo']);
    });

    it('equality narrowing works with less strict comparison', function () {
      interface Container {
        value: number | null | undefined;
      }
      function multiplyValue(container: Container, factor: number) {
        if (container.value != null) {
          return container.value*factor;
        } else {
          return container.value;
        }
      }
      const containerA: Container = { value: 5 };
      expect(multiplyValue(containerA, 5)).toBe(25);
    });
  });

  describe('in and instanceof operator narrowing', function () {
    it('in operator true branch narrows to required or optional property', function () {
      type Fish = { swim: () => string };
      type Bird = { fly: () => string };
      const salmon: Fish = { swim: () => 'I can swim' };
      const blueJay: Bird = { fly: () => 'I can fly' };
      function move(animal: Fish | Bird) {
        if ("swim" in animal) {
          return animal.swim();
        }
        return animal.fly();
      }
      expect([move(salmon), move(blueJay)]).toEqual(['I can swim', 'I can fly']);
    });

    it('instanceof used for type narrowing but most effective with classes', function () {
      function logValue(x: Date | string) {
        return (x instanceof Date) ? x.toUTCString() : x.toUpperCase();
      }
      expect(logValue(new Date())).toMatch(/GMT/)
    });
  });

  describe('Assignments and Control Flow analysis', function () {
    describe('Variable Assignment', function () {
      it("right side of assignment appropriately narrows the left side", () => {
        results = [];
        const x = Math.random() < 0.5 ? 10 : 'hello world'; // x: string | number
        results.push(x);
        [1, 'goodbye'].forEach(x => results.push(x)); // reassignment possible because x: string | number
        expect(results.slice(1)).toEqual([1, 'goodbye']);
      });

      it('control flow analysis narrows or re-merges types', function () {
        function example() {
          let x: number | string | boolean;
          if (Math.random() > 0.6) {
            x = Math.random() < 0.5; // x: boolean
          } else if (Math.random() < 0.4) {
            x = 'hello'; // x: string
          } else {
            x = 100; // x: number
          }
          return x; // x: string | number | boolean, because the branch can be any of the three
        }
        expect([true, false, 'hello', 100]).toContain(example());
      });
    });
  });

  describe('Type Predicates', function () {
    it('use type predicates to force narrowing', function () {
      type Fish = { swim: () => string };
      type Bird = { fly: () => string };
      function getSmallPet(): Fish | Bird {
        const fish: Fish = { swim: () => 'I can swim.' };
        const bird: Bird = { fly: () => 'I can fly.' };
        return Math.random() < 0.5 ? fish : bird;
      }
      // 'pet is Fish', this is a type predicate, it forces the function to narrow to a certain type
      // when the parameters comes in as a union type.  Note parameterName is type, the parameterName
      // must be one of the function parameter names
      function isFish(pet: Fish | Bird): pet is Fish {
        return (pet as Fish).swim !== undefined; // 'pet as Fish' narrows the pet to a Fish from the
        // union type Fish | Bird
      }
      const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
      const underWaterOne: Fish[] = zoo.filter(isFish);
      const underWaterTwo: Fish[] = zoo.filter(isFish) as Fish[];

      [underWaterOne, underWaterTwo].forEach(fishArray => {
        expect([0, 1, 2, 3]).toContain(fishArray.length);
      });
    });
  });

  describe('Discriminated Unions and Exhaustiveness Checking', function () {
    interface Circle {
      kind: 'circle',
      radius: number
    }
    interface Square {
      kind: 'square',
      sideLength: number
    }
    // much better a union type, we are guaranteed to have radius or sideLength when we narrow
    type Shape = Circle | Square;
    function getArea(shape: Shape) {
      switch (shape.kind) {
        case 'circle': {
          return Math.PI * shape.radius ** 2;
        }
        case 'square': {
          return shape.sideLength ** 2;
        }
      }
    }
    // in this case if we were to add a Triangle to the Shape union and not account for it
    // in our switch statement we would raise a compile error because the never type cannot
    // be assigned any type other than itself, so we would have _exhaustiveCheck: never = Triangle
    // and this is not allowed
    function getAreaWithNever(shape: Shape) {
      switch (shape.kind) {
        case 'circle': {
          return Math.PI * shape.radius ** 2;
        }
        case 'square': {
          return shape.sideLength ** 2;
        }
        default: {
          const _exhaustiveCheck: never = shape;
          return _exhaustiveCheck;
        }
      }
    }
    /* this interface is flawed, the reason both radius and sideLength are optional is because
     regardless of what shape we choose the radius and the length could still be undefined.
    interface ShapeFlawed {
      kind: 'circle' | 'square',
      radius?: number,
      sideLength?: number
    }
    */

    it('we can narrow discriminated unions', function () {
      const square: Shape = { kind: 'square', sideLength: 2 }
      expect(getArea(square)).toBe(4);
    });

    it('never can help with type narrowing', function () {
      const circle: Shape = { kind: 'circle', radius: 2 }
      const area = getAreaWithNever(circle);
      expect(area.toFixed(2)).toBe('12.57');
    });
  });
});
