const chalk = require("chalk").bold;

const recursiveWatch = require("recursive-watch");
const _config = require("./config");

const compiler = require("./compiler");

const IS_TEST = (process.env.NODE_ENV == "test");

module.exports = function() {
	const config = _config.loadFromArgs.apply(null, arguments);

	const watchers = [];

	function watch(src, callback){
		watchers.push(recursiveWatch(src, callback));
	}

	function unwatchAll(){
		watchers.forEach(function(unwatch){
			unwatch();
		});
	}

	config.forEach(function(entry){
		function compile(){
			compiler([
				entry
			]);
		}

		// TODO: Find a way to add coverage for this callback		
		function onChange(filename){
			logChange(`Change in '${filename}'`);
			logChange("Compiling...");
			compile();
			logSuccess();
		}

		watch(entry.dir, onChange);
		logSource(`Watching '${entry.dir}'`);

		watch(entry.type, onChange);
		logSource(`Watching '${entry.type}'`);

		compile();
	});

	return unwatchAll;
}

/* istanbul ignore next */
function logSource(msg){
	if(!IS_TEST)
		console.log(chalk.bold.blueBright(msg));
}

/* istanbul ignore next */
function logChange(msg){
	if(!IS_TEST)
		console.log(chalk.bold.yellowBright(msg));
}


/* istanbul ignore next */
function logSuccess(){
	if(!IS_TEST)
		console.log(chalk.bold.green("Done!"));
}