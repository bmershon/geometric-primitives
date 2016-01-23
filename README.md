# Geometric Primitives

For more information please visit

http://www.ctralie.com/Teaching/COMPSCI290/Assignments/Mini1_GeometricPrimitives/

Instructor: Chris Tralie

Student: Brooks Mershon

## Development

2 hours spent on Task 1-3, **spent primarily on figuring out how to test problems like these without a GUI**.

45 min spent on Task 4, reading Wikipedia page, implementing Cramer's rule, writing a few tests.

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