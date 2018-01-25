const fs = require("fs");
const path = require("path");

const DEFAULT_JS = "typed-directory.config.js";
module.exports.DEFAULT_JS = DEFAULT_JS;

const DEFAULT_JSON = "typed-directory.config.json";
module.exports.DEFAULT_JSON = DEFAULT_JSON;


function resolveFile(filename){
	return path.resolve(process.cwd(), filename);
}

module.exports.load = function(filename) {
	if(filename){
		if(path.isAbsolute(filename)){
			return require(filename);
		}else{
			filename = resolveFile(filename);

			if(fs.existsSync(filename)){
				return require(filename);
			}else{
				throw new Error(`Config file does not exist: '${filename}'.`);
			}			
		}
	}

	filename = resolveFile(DEFAULT_JS);
	if(fs.existsSync(filename)){
		return require(filename);
	}

	filename = resolveFile(DEFAULT_JSON);
	if(fs.existsSync(filename)){
		return require(filename);
	}

	throw new Error(`Default config file not found. Use '${DEFAULT_JS}' or '${DEFAULT_JSON}'`);
}