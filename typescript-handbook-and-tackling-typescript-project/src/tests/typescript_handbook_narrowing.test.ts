describe('TypeScript Handbook Narrowing', function () {

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
      type Fish = { swim: () => void };
      type Bird = { fly: () => void };
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
    
  });

});