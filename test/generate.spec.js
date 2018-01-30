const fs = require("fs");
const path = require("path");

const utils = require("./utils");
const assertFileMatch = utils.assertFileMatch;
const getRootDir = utils.getRootDir;
const getPaths = utils.getPaths;
const getOutputPath = utils.getOutputPath;
const loadExpected = utils.loadExpected;

const generate = requireSrc("generate");

describe("generate", function(){
	
	var outputPath = null;
	afterEach(function(){
		if(outputPath){
			try {
				fs.unlinkSync(outputPath);
			}catch(e){
				
			}
			outputPath = null;
		}
	});

	it("Is a function", function(){
		assert.isFunction(generate);
	});
		
	it("Can generate a file with instance", function(){
		const {rootDir, content, type} = getPaths("animals", "Animal.ts");
		outputPath = getOutputPath(rootDir);

		const provided = generate(content, type, outputPath, true);
		const expected = loadExpected(rootDir);

		assertFileMatch(provided, expected);
	});

	it("Can generate a file with class", function(){
		const {rootDir, content, type} = getPaths("classes", "BaseClass.ts");
		outputPath = getOutputPath(rootDir);

		const provided = generate(content, type, outputPath);
		const expected = loadExpected(rootDir);

		assertFileMatch(provided, expected);
	});

	it("Can generate a file with relative path", function(){
		const {content, type} = getPaths("animals", "Animal.ts");

		const outDir = getRootDir("relative");
		outputPath = getOutputPath(outDir);

		const provided = generate(content, type, outputPath, true);
		const expected = loadExpected(outDir);

		assertFileMatch(provided, expected);
	});

	it("Fail if directory doesn't exist", function(){
		const {rootDir, content, type} = getPaths("doesNotExist", "DoesNotExist.ts");
		outputPath = getOutputPath(rootDir);

		assert.throws(function(){
			generate(content, type, outputPath);
		},
		Error,
		/Source directory doesn't exist '.*'/);
	});

	it("Fail if directory doesn't exist", function(){
		const {rootDir, content, type} = getPaths("classes", "DoesNotExist.ts");
		outputPath = getOutputPath(rootDir);

		assert.throws(function(){
			generate(content, type, outputPath);
		},
		Error,
		/Type file doesn't exist '.*'/);
	});
});