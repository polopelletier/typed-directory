const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");

const watch = requireSrc("watch");

const ANIMAL_FILENAME = path.resolve(__dirname, "content/animals.ts");
const CLASSES_FILENAME = path.resolve(__dirname, "content/classes.ts");

const CONFIG_FILENAME = path.resolve(__dirname, "config/typed-directory.config.js");

describe("watch", function() {
	var watcher = null;

	afterEach(function(){
		if(watcher){
			// Unwatch
			watcher();
			watcher = null;
		}

		try {
			fs.unlinkSync(ANIMAL_FILENAME);
		}catch(e){

		}

		try {
			fs.unlinkSync(CLASSES_FILENAME);
		}catch(e){

		}
	});

	it("Is a function", function(){
		assert.isFunction(watch);
	});

	it("Can run with unique entry (command line)", function(done){
		const dir = path.resolve(__dirname, "content/animals");
		const type = path.resolve(__dirname, "content/Animal.ts");
		const output = ANIMAL_FILENAME;
		
		watcher = watch(output, type, dir);

		compareFiles("animals");

		checkWatch(done);
	});

	it("Can run with a config filename", function(done){
		watcher = watch(CONFIG_FILENAME);

		compareFiles("animals");
		compareFiles("classes");

		checkWatch(done);
	});

	it("Can run with a config object", function(done){
		const config = require(CONFIG_FILENAME);

		watcher = watch({
			filename: null,
			content: config
		});

		compareFiles("animals");
		compareFiles("classes");

		checkWatch(done);
	});

	it("Can run with a config object (content only)", function(done){
		const config = require(CONFIG_FILENAME);

		watcher = watch(config);

		compareFiles("animals");
		compareFiles("classes");

		checkWatch(done);
	});
});

function compareFiles(filename){
	const providedPath = path.resolve(__dirname, "content/", filename + ".ts");
	assert.isTrue(fs.existsSync(providedPath), `Expected '${filename}.ts' to have been outputed`);

	const expectedPath = path.resolve(__dirname, "content/expected", filename + ".ts");

	const provided = fs.readFileSync(providedPath).toString();
	const expected = fs.readFileSync(expectedPath).toString();

	const providedTrimmed = provided.split("\n").slice(1).join("\n");

	assert.deepEqual(providedTrimmed, expected);
}

function checkWatch(done){
	// TODO: Check if watcher is working properly
	setTimeout(done, 10);
}