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

function load(filename) {
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
module.exports.load = load;

function validate(config){
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
module.exports.validate = validate;

module.exports.loadFromArgs = function(){
	const args = Array.prototype.slice.apply(arguments);

	var config = null;

	if(args.length == 0){
		// Use default
		config = load();
	}else if(args.length >= 3){
		// Use source directory
		const entry = {
			output: args[0],
			type: 	args[1],
			dir: 	args[2]
		};
		
		if(args.length > 3){
			entry.instance = args[3];
		}

		config = {
			filename: null,
			content: [entry]
		};
	}else if(args.length == 1){
		if(typeof args[0] === "string"){
			// Use specified config file
			config = load(args[0]);
		}else if(Array.isArray(args[0])){
			// Use raw array
			config = {
				filename: null,
				content: args[0]
			};
		}else if(typeof args[0] === "object"){
			// Use full config
			config = args[0];
		}
	}

	if(config == null){
		throw new Error("Can't load config, arguments provided don't match any pattern. Please see documentation.");
	}

	try {
		validate(config.content);
	}catch(e){
		if(config.filename){
			throw new Error(`Error in config file '${config.filename}': ${e.message}`);
		}else{
			throw e;			
		}
	}

	return config.content;
};