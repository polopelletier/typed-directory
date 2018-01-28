const fs = require("fs");
const path = require("path");

const run = requireSrc("runner");

const { 
	compareFiles, 
	getRootDir, 
	getPaths, 
	getOutputPath
} = require("./utils");

const ANIMAL_PATH = getRootDir("animals");
const ANIMAL_FILENAME = getOutputPath(ANIMAL_PATH);

const CLASSES_PATH = getRootDir("classes");
const CLASSES_FILENAME = getOutputPath(CLASSES_PATH);

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
		const { rootDir, content, type } = getPaths("animals", "Animal.ts");
		
		run(ANIMAL_FILENAME, type, content);

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