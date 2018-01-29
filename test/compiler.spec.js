const fs = require("fs");
const path = require("path");

const compiler = requireSrc("compiler");

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

describe("compiler", function(){
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
		assert.isFunction(compiler);
	});

	it("Is exported as package main", function(){
		const rootCompiler = require("../index.js");
		assert.isFunction(rootCompiler);
		assert.equal(rootCompiler, compiler);
	});

	it("Can run with unique entry (command line)", function(){
		const { rootDir, content, type } = getPaths("animals", "Animal.ts");
		
		compiler(ANIMAL_FILENAME, type, content, true);

		compareFiles("animals");
	});

	it("Can run with a config filename", function(){
		compiler(CONFIG_FILENAME);

		compareFiles("animals");
		compareFiles("classes");
	});

	it("Can run with a config object", function(){
		const config = require(CONFIG_FILENAME);

		compiler({
			filename: null,
			content: config
		});

		compareFiles("animals");
		compareFiles("classes");
	});

	it("Can run with a config object (content only)", function(){
		const config = require(CONFIG_FILENAME);

		compiler(config);

		compareFiles("animals");
		compareFiles("classes");
	});
});