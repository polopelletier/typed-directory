const _config = require("./config");
const loadConfig = _config.load;
const validateConfig = _config.validate;

const generate = require("./generate");
const outputToFile = require("./outputToFile");

module.exports = function(filename = null, type = null, dir = null) {
	
	var config;

	if(type != null){
		config = {
			filename: null,
			content: [
				{
					"dir": dir,
					"type": type,
					"output": filename
				}
			]
		};
	}else if(typeof filename === "string"){
		config = loadConfig(filename);
	}else if(typeof filename === "object"){
		config = filename;
		if(Array.isArray(config)){
			config = {
				filename: null,
				content: config
			};
		}
	}

	try {
		validateConfig(config.content);		
	}catch(e){
		if(config.filename){
			throw new Error(`Error in config file '${config.filename}': ${e.message}`);
		}else{
			throw e;			
		}
	}

	run(config.content);
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