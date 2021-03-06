const fs = require("fs");

const utils = require("./utils");
const assertFileMatch = utils.assertFileMatch;
const getRootDir = utils.getRootDir;
const getPaths = utils.getPaths;
const getOutputPath = utils.getOutputPath;
const loadExpected = utils.loadExpected;

const generate = requireSrc("generate");

describe("generate", function(){
	
	var outputPath = null;

	function reset(){
		if(outputPath){
			try {
				fs.unlinkSync(outputPath);
			}catch(e){
				// Might not exist
			}
			outputPath = null;
		}
	}

	beforeEach(reset);
	afterEach(reset);

	it("Is a function", function(){
		assert.isFunction(generate);
	});
		
	it("Can generate a file with instance", function(){
		const paths = getPaths("animals", "Animal.ts");
		const rootDir = paths.rootDir;
		const type = paths.type;
		outputPath = getOutputPath(rootDir);

		const provided = generate(rootDir, type, outputPath, true);
		const expected = loadExpected(rootDir);

		assertFileMatch(provided, expected);
	});

	it("Can generate a file with class", function(){
		const paths = getPaths("classes", "BaseClass.ts");
		const rootDir = paths.rootDir;
		const type = paths.type;
		outputPath = getOutputPath(rootDir);

		const provided = generate(rootDir, type, outputPath);
		const expected = loadExpected(rootDir);

		assertFileMatch(provided, expected);
	});

	it("Can generate a file with relative path", function(){
		const paths = getPaths("animals", "Animal.ts");
		const type = paths.type;

		const outDir = getRootDir("relative");
		outputPath = getOutputPath(outDir);

		const provided = generate(paths.rootDir, type, outputPath, true);
		const expected = loadExpected(outDir);

		assertFileMatch(provided, expected);
	});

	it("Fail if directory doesn't exist", function(){
		const paths = getPaths("doesNotExist", "DoesNotExist.ts");
		const rootDir = paths.rootDir;
		const type = paths.type;
		outputPath = getOutputPath(rootDir);

		assert.throws(function(){
			generate(rootDir, type, outputPath);
		},
		Error,
		/Source directory doesn't exist '.*'/);
	});

	it("Fail if directory doesn't exist", function(){
		const paths = getPaths("classes", "DoesNotExist.ts");
		const rootDir = paths.rootDir;
		const type = paths.type;
		outputPath = getOutputPath(rootDir);

		assert.throws(function(){
			generate(rootDir, type, outputPath);
		},
		Error,
		/Type file doesn't exist '.*'/);
	});
});