const fs = require("fs");
const path = require("path");

const config = requireSrc("config");

const EXPECTED = require("./config/typed-directory.config.js");

const PATH_CONFIG_JS = path.resolve(__dirname, "config", config.DEFAULT_JS);
const PATH_CONFIG_JSON = path.resolve(__dirname, "config", config.DEFAULT_JSON);

const PATH_CWD_JS = path.resolve(process.cwd(), config.DEFAULT_JS);
const PATH_CWD_JSON = path.resolve(process.cwd(), config.DEFAULT_JSON);

const CUSTOM_FILENAME = "myConfig.js";
const PATH_CWD_CUSTOM = path.resolve(process.cwd(), CUSTOM_FILENAME);

describe("config", function() {

	function reset(){
		try {
			fs.unlinkSync(PATH_CWD_JS);
		}catch(e){
			// Might not exist
		}

		try {
			fs.unlinkSync(PATH_CWD_JSON);
		}catch(e){
			// Might not exist
		}

		try {
			fs.unlinkSync(PATH_CWD_CUSTOM);
		}catch(e){
			// Might not exist
		}
	}

	beforeEach(reset);
	afterEach(reset);

	describe("constants", function() {
		it("Exists", function() {
			assert.isString(config.DEFAULT_JS);
			assert.isString(config.DEFAULT_JSON);
		});
	});

	describe("#load", function(){
		it("Is a function", function() {
			assert.isFunction(config.load);
		});

		it("Can load absolute paths", function(){
			const filename = path.resolve(process.cwd(), "test/config/", config.DEFAULT_JS);
			const provided = config.load(filename);
			assert.isString(provided.filename);
			assert.deepEqual(provided.content, EXPECTED);
		});

		it("Can load relative path", function(){
			copyFileSync(PATH_CONFIG_JS, PATH_CWD_CUSTOM);
			const provided = config.load(CUSTOM_FILENAME);
			assert.isString(provided.filename);
			assert.deepEqual(provided.content, EXPECTED);
		});

		it("Fail if file doesn't exist", function(){
			assert.throws(function(){
				config.load(CUSTOM_FILENAME);
			}, 
			Error,
			/does not exist: '.*'/);
		});

		it("Can default to js", function(){
			copyFileSync(PATH_CONFIG_JS, PATH_CWD_JS);

			const provided = config.load();
			assert.isString(provided.filename);
			assert.deepEqual(provided.content, EXPECTED);
		});

		it("Can default to json", function(){
			copyFileSync(PATH_CONFIG_JSON, PATH_CWD_JSON);

			const provided = config.load();
			assert.isString(provided.filename);
			assert.deepEqual(provided.content, EXPECTED);
		});

		it("Fail if no default exist", function(){
			assert.throws(function(){
				config.load();
			}, 
			Error,
			/Default config file not found. Use '.*' or '.*'/);
		});

		it("Fail on invalid js", function() {
			assert.throws(function(){
				config.load(path.resolve(__dirname, "config/invalid.js"));
			});
		}, SyntaxError);

		it("Fail on invalid json", function() {
			assert.throws(function(){
				config.load(path.resolve(__dirname, "config/invalid.json"));
			});
		}, SyntaxError);
	});

	describe("#validate", function(){
		it("Fail if is not an array", function(){
			assert.throws(function(){
				config.validate();
			},
			Error,
			/Content must be an array/);
		});

		it("Fail if item is not an object", function(){
			assert.throws(function(){
				config.validate([
					1
				]);
			},
			Error,
			/Item \d+ must be an object/);
		});

		it("Fail if item doesn't have a dir", function(){
			assert.throws(function(){
				config.validate([
					{
						dir: 0
					}
				]);
			},
			Error,
			/Item \d+ must have an input directory/);
		});

		it("Fail if item doesn't have a type", function(){
			assert.throws(function(){
				config.validate([
					{
						dir: "dir/subDir",
						type: 0
					}
				]);
			},
			Error,
			/Item \d+ must have a type filename/);
		});

		it("Fail if item doesn't have an output", function(){
			assert.throws(function(){
				config.validate([
					{
						dir: "dir/subDir",
						type: "type.ts",
						output: 0
					}
				]);
			},
			Error,
			/Item \d+ must have an output filename/);
		});

		it("Success if input is correct", function(){
			assert.doesNotThrow(function(){
				config.validate([
					{
						dir: "dir/subDir",
						type: "type.ts",
						output: "file.ts"
					}
				]);
			});
		});
	});

	describe("#loadFromArgs", function(){
		it("Can use default", function(){
			copyFileSync(PATH_CONFIG_JS, PATH_CWD_JS);

			const provided = config.loadFromArgs();
			assert.deepEqual(provided, EXPECTED);
		});

		it("Can use source directory (with instance)", function(){
			const provided = config.loadFromArgs(
				EXPECTED[0].output,
				EXPECTED[0].type,
				EXPECTED[0].dir,
				EXPECTED[0].instance);

			assert.deepEqual(provided, [
				EXPECTED[0]
			]);
		});

		it("Can use source directory", function(){
			const provided = config.loadFromArgs(
				EXPECTED[1].output,
				EXPECTED[1].type,
				EXPECTED[1].dir);

			assert.deepEqual(provided, [
				EXPECTED[1]
			]);
		});

		it("Can use specific config file", function(){
			const provided = config.loadFromArgs(PATH_CONFIG_JS);
			assert.deepEqual(provided, EXPECTED);
		});

		it("Can use raw array", function(){
			const provided = config.loadFromArgs(EXPECTED);
			assert.deepEqual(provided, EXPECTED);
		});

		it("Can use full config", function(){
			const provided = config.loadFromArgs({
				filename: null,
				content: EXPECTED
			});
			assert.deepEqual(provided, EXPECTED);
		});

		it("Fail if arguments don't match any pattern", function(){
			assert.throws(function(){
				config.loadFromArgs("str", 0);
			},
			Error,
			/arguments provided don't match any pattern/);

			assert.throws(function(){
				config.loadFromArgs(0);
			},
			Error,
			/arguments provided don't match any pattern/);
		});

		it("Can handle invalid config", function(){
			assert.throws(function() {
				config.loadFromArgs({
					filename: "config.json",
					content: "Should be array"
				});
			},
			Error,
			/Error in config file '.*'/);

			assert.throws(function() {
				config.loadFromArgs({
					filename: null,
					content: "Should be array"
				});
			},
			Error);
		});
	});
});

function copyFileSync(src, dest){
	const content = fs.readFileSync(src).toString();
	fs.writeFileSync(dest, content);
}