const path = require("path");

const run = require("../../src/runner");

const dir 		= path.resolve(__dirname, "../animals/content");
const type 		= path.resolve(__dirname, "../animals/Animal.ts");
const output 	= path.resolve(__dirname, "output.ts");

run(output, type, dir);