const path = require("path");

const compiler = require("../../src/runner");

const dir 		= path.resolve(__dirname, "content");
const type 		= path.resolve(__dirname, "BaseClass.ts");
const output 	= path.resolve(__dirname, "output.ts");

compiler(output, type, dir, false);