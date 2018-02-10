const fs = require("fs");
const path = require("path");

const watch = requireSrc("watch");

const utils = require("./utils");
const compareFiles = utils.compareFiles;
const getRootDir = utils.getRootDir;
const getPaths = utils.getPaths;
const getOutputPath = utils.getOutputPath;

const ANIMAL_PATH = getRootDir("animals");
const ANIMAL_FILENAME = getOutputPath(ANIMAL_PATH);

const CLASSES_PATH = getRootDir("classes");
const CLASSES_FILENAME = getOutputPath(CLASSES_PATH);

const NEW_FILENAME = path.resolve(ANIMAL_PATH, "zoo/elephant.ts");

const CONFIG_FILENAME = path.resolve(__dirname, "config/typed-directory.config.js");

describe("watch", function() {
	var watcher = null;

	this.timeout(10 * 1000);

	function reset(){
		if(watcher){
			// Unwatch
			watcher();
			watcher = null;
		}

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

		try {
			fs.unlinkSync(NEW_FILENAME);
		}catch(e){
			// Might not exist
		}
	}

	beforeEach(reset);
	afterEach(function(){
		if(watcher){
			watcher();
			watcher = null;
		}

		reset();
	});

	after(function(done){
		// Need to make sure cleanup has been done when this suite is done
		setTimeout(function(){
			reset();
			done();
		}, 1500);
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
		const paths = getPaths("animals", "Animal.ts");
		const type = paths.type;
		
		watcher = watch(ANIMAL_FILENAME, type, paths.rootDir, true);

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

const WATCH_DELAY = 500;

/*eslint-disable */
const NEW_FILE_CONTENT = 	'import Animal from "../../Animal";' + '\n' +
							'' + '\n' +
							'export default new Animal("Elephant", "Pawoo!");';
/*eslint-enable */

function checkWatch(done){
	var complete = false;
	var hasWatch = false;

	function onComplete(message){
		if(!complete){
			complete = true;
			fs.unwatchFile(ANIMAL_FILENAME);
			done(message);
		}
	}

	fs.watchFile(ANIMAL_FILENAME, 
		{
			interval: WATCH_DELAY
		},
		function(){
			if(!complete && !hasWatch){
				hasWatch = true;

				setTimeout(function(){
					var expectedLines = utils.loadExpected(ANIMAL_PATH).split("\n");

					// Trim header
					expectedLines = expectedLines.slice(1);

					// Adding the 3 new lines
					
					/*eslint-disable */
					expectedLines.splice(4, 0, 'import _zoo_elephant from "./zoo/elephant";');
					expectedLines.splice(9, 0, 'const zoo_elephant:Animal = _zoo_elephant;');
					expectedLines.splice(18, 0, '\t\t"elephant": zoo_elephant,');
					/*eslint-enable */

					const expected = expectedLines.join("\n");

					const provided = utils.trimHeader(utils.loadProvided(ANIMAL_PATH));

					assert.equal(provided, expected);

					onComplete();
				}, WATCH_DELAY);

			}
		});

	// Wait a bit before making change (otherwise watch does not trigger)
	setTimeout(function(){
		if(!complete){
			fs.writeFileSync(NEW_FILENAME, NEW_FILE_CONTENT);			
		}

		// Give watch time to trigger before failing with timeout
		setTimeout(function(){
			if(!hasWatch){
				onComplete("Timed out: watch callback has not been called in the expected delay");				
			}
		}, WATCH_DELAY * 2);

	}, WATCH_DELAY);

}