# Geometric Primitives

For more information please visit

http://www.ctralie.com/Teaching/COMPSCI290/Assignments/Mini1_GeometricPrimitives/

Instructor: Chris Tralie

Student: Brooks Mershon

## Development

2 hours spent on Task 1-3, **spent primarily on figuring out how to test problems like these without a GUI**.

45 min spent on Task 4, reading Wikipedia page, implementing Cramer's rule, writing a few tests.

## Impressions

This is a fun introduction to the material and very manageable in scope. I particularly like the idea of the last two tasks representing a induction on the number of dimensions in the problem. It is possible to reuse code written in Task 4.

I hope to get better at thinking up test cases that really check all edge cases for geometry problems. Here, I was a little lax, but for more complex assignments I intend to use the current testing strategy I've implemented to think through comprehensive test cases. When GUI testing is not available, that's all I've got!

No matter how simple, I believe every assignment should treat itself like it is "serious" production code, because I feel like the end goal of the course should be to produce code that is bulletproof and maintainable for whatever geometry problems people are trying to solve.

## Testing

In the root directory, install Tape and Faucet for unit testing:

```bash
npm intall
```

To run all tests:

```
npm test
```

This runs the following bash command from the scripts found in *package.json*:

```json
"test": "./node_modules/.bin/faucet `find test -name '*-test.js'`"
```

To run a particular test in the *test/* directory and summarize output:

```bash
node aboveOrBelow-test.js | faucet
```

This pipes the TAP (test-anywhere-protocol) output from the Tape library to another libary called faucet, which makes the output human readable. That's a nice thing.