describe('TypeScript Handbook Narrowing', function () {
  let results;
  describe('Truthiness and Equality Narrowing', function () {
    it('truthiness narrowing', function () {
      function returnAll(strs: string | string[] | null) {
        if (strs && typeof strs === 'object') {
          return strs.join(' ');
        } else {
          return strs;
        }
      }
      expect(returnAll(['foo', 'bar'])).toBe('foo bar');
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
        let x = Math.random() < 0.5 ? 10 : 'hello world'; // x: string | number
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

  describe('Discriminated Unions', function () {

  });
});