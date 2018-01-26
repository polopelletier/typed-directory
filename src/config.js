const fs = require("fs");
const path = require("path");

const DEFAULT_JS = "typed-directory.config.js";
module.exports.DEFAULT_JS = DEFAULT_JS;

const DEFAULT_JSON = "typed-directory.config.json";
module.exports.DEFAULT_JSON = DEFAULT_JSON;


function resolveFile(filename){
	return path.resolve(process.cwd(), filename);
}

function wrapConfig(filename){
	return {
		filename: filename,
		content: require(filename)
	};
}

module.exports.load = function(filename) {
	if(filename){
		if(path.isAbsolute(filename)){
			return wrapConfig(filename);
		}else{
			filename = resolveFile(filename);

			if(fs.existsSync(filename)){
				return wrapConfig(filename);
			}else{
				throw new Error(`Config file does not exist: '${filename}'.`);
			}			
		}
	}

	filename = resolveFile(DEFAULT_JS);
	if(fs.existsSync(filename)){
		return wrapConfig(filename);
	}

	filename = resolveFile(DEFAULT_JSON);
	if(fs.existsSync(filename)){
		return wrapConfig(filename);
	}

	throw new Error(`Default config file not found. Use '${DEFAULT_JS}' or '${DEFAULT_JSON}'`);
}

module.exports.validate = function(config){
	if(!Array.isArray(config)){
		throw new Error("Content must be an array");
	}

	config.forEach(function(file, i){
		if(typeof file !== "object"){
			throw new Error(`Item ${i} must be an object.`);
		}
		if(typeof file.dir !== "string"){
			throw new Error(`Item ${i} must have an input directory (missing key 'dir')`);
		}
		if(typeof file.type !== "string"){
			throw new Error(`Item ${i} must have a type filename (missing key 'type')`);	
		}
		if(typeof file.output !== "string"){
			throw new Error(`Item ${i} must have an output filename (missing key 'output')`);
		}
	});
}