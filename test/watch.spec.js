const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");

const watch = requireSrc("watch");

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

	it("Is exported as typed-directory/watch", function(){
		const rootWatch = require("../watch");
		assert.isFunction(rootWatch);
		assert.equal(rootWatch, watch);
	});


	it("Can run with unique entry (command line)", function(done){
		const { rootDir, content, type } = getPaths("animals", "Animal.ts");
		
		watcher = watch(ANIMAL_FILENAME, type, content, true);

		compareFiles("animals");

		checkWatch("animals", done);
	});

	it("Can run with a config filename", function(done){
		watcher = watch(CONFIG_FILENAME);

		compareFiles("animals");
		compareFiles("classes");

		checkWatch("animals", done);
	});

	it("Can run with a config object", function(done){
		const config = require(CONFIG_FILENAME);

		watcher = watch({
			filename: null,
			content: config
		});

		compareFiles("animals");
		compareFiles("classes");

		checkWatch("animals", done);
	});

	it("Can run with a config object (content only)", function(done){
		const config = require(CONFIG_FILENAME);

		watcher = watch(config);

		compareFiles("animals");
		compareFiles("classes");

		checkWatch("animals", done);
	});
});

function checkWatch(dir, done){
	// TODO: Check if watcher is working properly
	setTimeout(done, 10);
}