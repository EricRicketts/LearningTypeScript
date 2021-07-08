describe('TypeScript Handbook More On Functions', function () {
  let results, expected;
  describe('Function Type Expressions and Call Signatures', function () {
    describe('Function Type Expression', function () {
      function greeterOne(fn: (a: string) => string) {
        return fn('Hello, World!');
      }
      function returnText(a: string) {
        return a;
      }
      type GreetFunction = (a: string) => string;
      const logText = function (a: string): string {
        return a;
      }
      function greeterTwo(fn: GreetFunction) {
        return fn('Fizz Buzz.');
      }
      /*
       It is really important to understand how functions are typed.  functions are essential in Javascript,
       along with objects, they are the essential building blocks of the language.  So it is important to
       learn how to describe a function's signature.  In the case below, for greeterOne we provide a type
       for that function using a function type expression.  As one can see, it is syntactically similar to
       an arrow function.  Inside the definition of greeterOne we define a parameter which is itself a
       function, with a single string argument and a return value which is a string.  A function type
       expression MUST HAVE a parameter name.

       We can use a type alias to type a function.  This is what I did for greeterTwo, I used a type alias
       for greeterTwo's function type.
      */
      it('function expressions or types used for function parameters', function () {
        expected = ['Hello, World!', 'Fizz Buzz.'];
        results = [greeterOne(returnText), greeterTwo(logText)];
        expect(results).toEqual(expected);
      });
    });

    describe('Function Call Signature', function () {
      type Log = (
        message: string,
        userId?: string,
      ) => string;

      type anotherLog = {
        (message: string, userId?: string): string;
      }

      let logDate: Log = function(message, userId ) {
          let time = new Date().toUTCString();
          if (userId === undefined) {
            userId = 'Not signed in'
          }
          return `${userId} has message ${message} says the time is ${time}.`
      }

      let anotherLogDate: anotherLog = function(message, userId) {
        let time = new Date().toUTCString();
        if (userId === undefined) {
          userId = 'Not signed in'
        }
        return `${userId} has message ${message} says the time is ${time}.`
      }
     /*
      I have included two different ways to invoke call signatures on functions.
      In the first case we define a type Log which uses a function type expression to define
      the functions parameters and the return value of the function.

      In the second case, we use an object type with properties (anotherLog).  In this case we
      have to group the properties together much like a function expression, but we use ':' to
      defined the return value type instead of '=>'.
     */
      it('call signature using function type expression', function () {
        results = logDate('foobar', 'ElmerFudd');
        expect(results).toMatch(/ElmerFudd has message foobar says the time is/);
      });

      it('call signature using object properties', function () {
        results = anotherLogDate('foobar', 'ElmerFudd');
        expect(results).toMatch(/ElmerFudd has message foobar says the time is/);
      });
    });
  });
  describe('Generic Functions', function () {
    describe('Inference', function () {
      function firstElement<Type>(arr: Type[]): Type {
        return arr[0];
      }
      function mapInputToOutput<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
        return arr.map(func);
      }
      /*
        Generics can be used to describe a correspondence between two values.  We do this by defining a
        Type parameter in the function signature.  Note by using the Type parameter in two places in the firstElement
        function we create a relationship between the input (an array) and the output one of the array elements.

        In the second example, mapInputToOutput TypeScript can infer the values of both the Input and Output based
        on the Input type and the return value of the function expression (string => number).
      */
      it('infers Type by the input array', function () {
        expected = [1, 'foo'];
        results = [firstElement([1, 2, 3, 4]), firstElement(['foo', 'bar', 'fizz', 'buzz'])];
        expect(results).toEqual(expected);
      });

      it('can infer from multiple type parameters', function () {
        expected = [1, 2, 3];
        results = mapInputToOutput(["1", "2", "3"], function(el) { return Number.parseInt(el); })
        expect(results).toEqual(expected);
      });
    });

    describe('Constraints', function () {
      describe('Basic Usage', function () {
        function longest<Type extends { length: number }>(a: Type, b: Type) {
          if (a.length >= b.length) {
            return a;
          } else {
            return b;
          }
        }

        it('used to constrain the acceptable type parameter', function () {
          /*
            this is a very important example, so we constrained the type parameter which is a generic, to a type
            which has a length property and that length property must return a number.  So TypeScript would flag
            a call such as: longest(10, 5) because numbers in Javascript do not have a length property.
          */
          expected = [[1, 2, 3, 4], 'foobar'];
          results = [longest([1, 2, 3, 4], [1, 2, 3]), longest('fizz', 'foobar')];
          expect(results).toEqual(expected);
        });
      });

      describe('Specifying Type Arguments', function () {
        function combine<Type>(a: Type[], b: Type[]): Type[] {
          return a.concat(b);
        }

        it('can specify additional constraints at invocation', function () {
          /*
            I originally tried to place the constraint at invocation as < string[] | number[]>.  This was wrong
            because the Type is a generic input type, but the parameters themselves are arrayed Types, so this is
            why the invocation below works.
          */
          expected = [1, 2, 3, 'hello'];
          results = combine<string | number>([1, 2, 3], ['hello'])
          expect(results).toEqual(expected);
        });
      });

      describe('Guidelines for Writing Good Generic Functions', function () {
        it('push type parameters down', function () {
          /*
            firstElement1 is the better way of doing things as the return type is inferred.  firstElement2 inferred
            type is any because TypeScript has to resolve the arr[0] expression using the constraint type =>
            <Type extends any[]> rather 'waiting' to resolve the element during a call.

            RULE: When possible, use the Type parameter itself rather than constraining it.
          */
          const firstElement1 = function<Type>(a: Type[]) {
            return a[0];
          }
          const firstElement2 = function<Type extends any[]>(a: Type) {
            return a[0];
          }
          expected = [1, 2];
          results = [firstElement1([1, 2, 3]), firstElement2([2, 3, 4])];
          expect(results).toEqual(expected);
        });

        it('use fewer type parameters', function () {
          /*
            we have an excessive Type parameter with Func it does nothing to relate the input to output values, all it
            does is obfuscate what the function is trying to do.

            RULE: Always use a few type parameters as possible
          */
          const filter1 = function<Type>(a: Type[], func: (arg: Type) => boolean): Type[] {
            return a.filter(func);
          }
          const filter2 = function<Type, Func extends (arg: Type) => boolean>(
            a: Type[],
            func: Func
          ): Type[] {
            return a.filter(func);
          }
          const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          results = [filter1(arr, n => n % 2 === 0)];
          results.push(filter2(arr, function(n) { return n % 2 !== 0}));
          expected = [[2, 4, 6, 8, 10], [1, 3, 5, 7, 9]];
          expect(results).toEqual(expected);
        });
      });
    });
  });
});