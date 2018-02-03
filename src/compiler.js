const configFromArgs = require("./config").loadFromArgs;

const generate = require("./generate");
const outputToFile = require("./outputToFile");

module.exports = function() {
	const config = configFromArgs.apply(null, arguments);
	run(config);
};

function run(config){
	config.forEach(function(entry){
		var instance = false;
		if(entry.instance === true){
			instance = true;
		}

		const content = generate(entry.dir, entry.type, entry.output, instance);
		outputToFile(entry.output, content);
	});
}