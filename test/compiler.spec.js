const fs = require("fs");
const path = require("path");

const compiler = requireSrc("compiler");

const utils = require("./utils");
const compareFiles = utils.compareFiles;
const getRootDir = utils.getRootDir;
const getPaths = utils.getPaths;
const getOutputPath = utils.getOutputPath;

const ANIMAL_PATH = getRootDir("animals");
const ANIMAL_FILENAME = getOutputPath(ANIMAL_PATH);

const CLASSES_PATH = getRootDir("classes");
const CLASSES_FILENAME = getOutputPath(CLASSES_PATH);

const CONFIG_FILENAME = path.resolve(__dirname, "config/typed-directory.config.js");

describe("compiler", function(){
	function reset(){
		try {
			fs.unlinkSync(ANIMAL_FILENAME);
		}catch(e){
			// Might not exist
		}

		try {
			fs.unlinkSync(CLASSES_FILENAME);
		}catch(e){
			// Might not exist
		}
	}

	beforeEach(reset);
	afterEach(reset);

	it("Is a function", function(){
		assert.isFunction(compiler);
	});

	it("Is exported as package main", function(){
		const rootCompiler = require("../index.js");
		assert.isFunction(rootCompiler);
		assert.equal(rootCompiler, compiler);
	});

	it("Can run with unique entry (command line)", function(){
		const paths = getPaths("animals", "Animal.ts");
		const type = paths.type;
		
		compiler(ANIMAL_FILENAME, type, paths.rootDir, true);

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