describe('TypeScript Handbook More On Functions', function () {
  let results, expected;
  describe('Function Type Expressions, Call Signatures, and Construct Signatures', function () {
    function greeterOne(fn: (a: string) => string) {
      return fn('Hello, World!');
    }
    function returnText(a: string) {
      return a;
    }
    type GreetFunction = (a: string) => string;
    const logText: GreetFunction = function (a: string) {
      return a;
    }
    function greeterTwo(logText: GreetFunction) {
      return logText('Fizz Buzz.');
    }

    it('function expressions or types used for function parameters', function () {
      expected = ['Hello, World!', 'Fizz Buzz.'];
      results = [greeterOne(returnText), greeterTwo(logText)];
      expect(results).toEqual(expected);
    });
  }); 
});