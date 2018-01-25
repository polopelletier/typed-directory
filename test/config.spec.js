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
	describe("constants", function() {
		it("Exists", function() {
			assert.isString(config.DEFAULT_JS);
			assert.isString(config.DEFAULT_JSON);
		});
	});

	describe("#load", function(){
		afterEach(function(){
			try {
				fs.unlinkSync(PATH_CWD_JS);
			}catch(e){

			}

			try {
				fs.unlinkSync(PATH_CWD_JSON);
			}catch(e){

			}

			try {
				fs.unlinkSync(PATH_CWD_CUSTOM);
			}catch(e){

			}
		});

		it("Is a function", function() {
			assert.isFunction(config.load);
		});

		it("Can load absolute paths", function(){
			const filename = path.resolve(process.cwd(), "test/config/", config.DEFAULT_JS);
			const provided = config.load(filename);
			assert.deepEqual(provided, EXPECTED);
		});

		it("Can load relative path", function(){
			fs.copyFileSync(PATH_CONFIG_JS, PATH_CWD_CUSTOM);
			const provided = config.load(CUSTOM_FILENAME);
			assert.deepEqual(provided, EXPECTED);
		});

		it("Fail if file doesn't exist", function(){
			assert.throws(function(){
				config.load(CUSTOM_FILENAME);
			}, 
			Error,
			/does not exist: '.*'/);
		});

		it("Can default to js", function(){
			fs.copyFileSync(PATH_CONFIG_JS, PATH_CWD_JS);

			const provided = config.load();
			assert.deepEqual(provided, EXPECTED);
		});

		it("Can default to json", function(){
			fs.copyFileSync(PATH_CONFIG_JSON, PATH_CWD_JSON);

			const provided = config.load();
			assert.deepEqual(provided, EXPECTED);
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
});