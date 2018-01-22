const fs = require("fs");
const path = require("path");

const generate = requireSrc("generate");

const OUT = path.resolve(__dirname, "content", "provided.ts");

describe("generate", function(){
	it("Is a function", function(){
		assert.isFunction(generate);
	});
		
	it("Can generate a file with instance", function(){
		const DIR = getContentPath("animals");
		const TYPE = path.resolve(__dirname, "content/Animal.ts");

		const provided = generate(DIR, TYPE, OUT);

		const expected = loadExpected("animals");

		assertFileMatch(provided, expected);
	});

	it("Can generate a file with class", function(){
		const DIR = getContentPath("classes");
		const TYPE = path.resolve(__dirname, "content/BaseClass.ts");

		const provided = generate(DIR, TYPE, OUT, false)

		const expected = loadExpected("classes");

		assertFileMatch(provided, expected);
	});

	it("Can generate a file with relative path", function(){
		const DIR = getContentPath("animals");
		const TYPE = path.resolve(__dirname, "content/Animal.ts");
		const outRelative = path.resolve(__dirname, "provided/provided.ts");

		const provided = generate(DIR, TYPE, outRelative);

		const expected = loadExpected("relative");

		assertFileMatch(provided, expected);
	});
});

function assertFileMatch(provided, expected, message){
	assert.isString(provided, "Expected result to be a String");
	assert.equal(provided, expected, message);
}

function getContentPath(dir){
	return path.resolve(__dirname, "content", dir);
}

function loadExpected(filename){
	const fullname = path.resolve(__dirname, "content", filename + ".ts");
	return fs.readFileSync(fullname).toString();
}