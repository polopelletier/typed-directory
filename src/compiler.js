const _config = require("./config");

const generate = require("./generate");
const outputToFile = require("./outputToFile");

module.exports = function() {
	const config = _config.loadFromArgs.apply(null, arguments);
	run(config);
}

function run(config){
	config.forEach(function(entry){
		var instance = true;
		if(entry.instance === false){
			instance = false;
		}

		const content = generate(entry.dir, entry.type, entry.output, instance);
		outputToFile(entry.output, content);
	});
}