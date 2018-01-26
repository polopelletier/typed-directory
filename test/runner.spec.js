const fs = require("fs");
const path = require("path");

const run = requireSrc("runner");

const ANIMAL_FILENAME = path.resolve(__dirname, "content/animals.ts");
const CLASSES_FILENAME = path.resolve(__dirname, "content/classes.ts");

const CONFIG_FILENAME = path.resolve(__dirname, "config/typed-directory.config.js");

describe("runner", function(){
	afterEach(function(){
		try {
			fs.unlinkSync(ANIMAL_FILENAME);
		}catch(e){

		}

		try {
			fs.unlinkSync(CLASSES_FILENAME);
		}catch(e){

		}
	})

	it("Is a function", function(){
		assert.isFunction(run);
	});

	it("Can run with unique entry (command line)", function(){
		const dir = path.resolve(__dirname, "content/animals");
		const type = path.resolve(__dirname, "content/Animal.ts");
		const output = ANIMAL_FILENAME;
		
		run(output, type, dir);

		compareFiles("animals");
	});

	it("Can run with a config filename", function(){
		run(CONFIG_FILENAME);

		compareFiles("animals");
		compareFiles("classes");
	});

	it("Can run with a config object", function(){
		const config = require(CONFIG_FILENAME);

		run({
			filename: null,
			content: config
		});

		compareFiles("animals");
		compareFiles("classes");
	});

	it("Can run with a config object (content only)", function(){
		const config = require(CONFIG_FILENAME);

		run(config);

		compareFiles("animals");
		compareFiles("classes");
	});
});

function loadExpected(filename){
	const fullname = path.resolve(__dirname, "content/expected", filename + ".ts");
	return fs.readFileSync(fullname).toString();
}

function compareFiles(filename){
	const providedPath = path.resolve(__dirname, "content/", filename + ".ts");
	assert.isTrue(fs.existsSync(providedPath), `Expected '${filename}.ts' to have been outputed`);

	const expectedPath = path.resolve(__dirname, "content/expected", filename + ".ts");

	const provided = fs.readFileSync(providedPath).toString();
	const expected = fs.readFileSync(expectedPath).toString();

	const providedTrimmed = provided.split("\n").slice(1).join("\n");

	assert.deepEqual(providedTrimmed, expected);
}