/* typed-directory ignore */
const path = require("path");

const compiler = require("../../src/compiler");

const dir 		= path.resolve(__dirname);
const type 		= path.resolve(__dirname, "Animal.ts");
const output 	= path.resolve(__dirname, "output.ts");

compiler(output, type, dir, true);