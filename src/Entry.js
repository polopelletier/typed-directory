const path = require("path");

const utils = require("./utils");

function Entry(filename, type, sourceDir, outputDir){
	this.filename = filename;
	this.type = type;

	const parsed = path.parse(filename);
	this.name = parsed.name;
	this.path = path.relative(sourceDir, parsed.dir);
	this.dir = path.relative(outputDir, parsed.dir);

	if(this.path.length == 0){
		this.varName = this.name;
	}else{
		this.varName = this.path.split(path.sep).join("_") + "_" + this.name;		
	}
	this.importPath = utils.getImportPath(this.dir, this.name);
}

Entry.prototype.getImportLine = function(){
	return `import _${this.varName} from "${this.importPath}";`;
}

Entry.prototype.getConstLine = function(){
	return `const ${this.varName}:${this.type} = _${this.varName};`;
}

module.exports = Entry;