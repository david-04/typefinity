# Change Log

## [0.0.4](https://github.com/david-04/typefinity/releases/tag/v0.0.4) (2025-05-10)

Breaking changes

- [expect.not.toBeFalsy](https://david-04.github.io/typefinity/classes/expect.NotAssertions.html) has been removed (use `expect.toBeTruthy` instead)
- [expect.not.toBeTruthy](https://david-04.github.io/typefinity/classes/expect.NotAssertions.html) has been removed (use `expect.toBeFalsy` instead)
- [expect.not.toReject](https://david-04.github.io/typefinity/classes/expect.NotAssertions.html) has been removed (use `expect.toResolve` instead)
- [expect.toResolve](https://david-04.github.io/typefinity/classes/expect.Assertions.html) no longer accepts parameters (use `expect(await actual).toBe(expected)` or `.toEqual(expected)` instead)
- `isFalsy` has been removed (type guarding did not always work accurately, especially with `unknown` and `any`)
- `isTruthy` has been removed (type guarding did not always work accurately, especially with `unknown` and `any`)

New features

- [expect.not.toBeInstanceOf](https://david-04.github.io/typefinity/classes/expect.NotAssertions.html)
- [expect.not.toMatch](https://david-04.github.io/typefinity/classes/expect.NotAssertions.html)
- [expect.toBeInstanceOf](https://david-04.github.io/typefinity/classes/expect.Assertions.html)
- [expect.toMatch](https://david-04.github.io/typefinity/classes/expect.Assertions.html)
- [isBoolean](https://david-04.github.io/typefinity/functions/isBoolean.html)
- [isNumber](https://david-04.github.io/typefinity/functions/isNumber.html)
- [isString](https://david-04.github.io/typefinity/functions/isString.html)

Bug fixes

- [Optional.map](https://david-04.github.io/typefinity/classes/Optional.html) now removes `null` and `undefined` from the mapper's return value

## [0.0.3](https://github.com/david-04/typefinity/releases/tag/v0.0.3) (2025-03-21)

New features

- [afterAll](https://david-04.github.io/typefinity/functions/afterAll.html)
- [afterEach](https://david-04.github.io/typefinity/functions/afterEach.html)
- [beforeAll](https://david-04.github.io/typefinity/functions/beforeAll.html)
- [beforeEach](https://david-04.github.io/typefinity/functions/beforeEach.html)
- [crash](https://david-04.github.io/typefinity/functions/crash.html)
- [describe](https://david-04.github.io/typefinity/functions/describe.html)
- [expect](https://david-04.github.io/typefinity/functions/expect.html)
- [fail](https://david-04.github.io/typefinity/functions/fail.html)
- `isFalsy` (was later removed in version 0.0.4)
- `isTruthy` (was later removed in version 0.0.4)
- [it](https://david-04.github.io/typefinity/functions/it.html)
- [Json](https://david-04.github.io/typefinity/types/Json.html)
- [optional](https://david-04.github.io/typefinity/functions/optional.html)
- [Optional](https://david-04.github.io/typefinity/classes/Optional.html)
- [randomBoolean](https://david-04.github.io/typefinity/functions/randomBoolean.html)
- [randomFalsyValue](https://david-04.github.io/typefinity/functions/randomFalsyValue.html)
- [randomItem](https://david-04.github.io/typefinity/functions/randomItem.html)
- [randomNumber](https://david-04.github.io/typefinity/functions/randomNumber.html)
- [randomNumberWithPrefix](https://david-04.github.io/typefinity/functions/randomNumberWithPrefix.html)
- [randomTruthyValue](https://david-04.github.io/typefinity/functions/randomTruthyValue.html)
- [ReadonlyJson](https://david-04.github.io/typefinity/types/ReadonlyJson.html)
- [trim](https://david-04.github.io/typefinity/functions/trim.html)
