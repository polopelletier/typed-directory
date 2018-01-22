const path = require("path");

function fixRelative(filename) {
	if(!filename.startsWith("../")){
		return "./" + filename;
	}
	return filename;
}

module.exports.getImportPath = function(dir, name){
	return fixRelative(path.join(dir, name));
}