const path = require("path");

const Entry = require("./Entry");
const utils = require("./utils");

function Generator(sourceDir, outputDir){
	this.sourceDir = sourceDir;
	this.outputDir = outputDir;

	this.tree = {};
	this.entries = [];
}

Generator.prototype.setType = function(typeFile, instance = true){
	const parsed = path.parse(typeFile);
	this.typeName = parsed.name;
	this.type = instance ? this.typeName : `{new(): ${this.typeName}}`;
	
	const typeDir = path.relative(this.outputDir, parsed.dir);
	this.typePath = utils.getImportPath(typeDir, this.typeName);
}

Generator.prototype.addFile = function(filename){
	const entry = new Entry(filename, this.type, this.sourceDir, this.outputDir);
	this.entries.push(entry);
	this.addToTree(entry);
}

Generator.prototype.addToTree = function(entry){
	var currentNode = this.tree;

	if(entry.path.length > 0){
		entry.path.split(path.sep)
			.forEach(function(part){
				if(!currentNode[part]){
					currentNode[part] = {};
				}
				currentNode = currentNode[part];
			});		
	}

	currentNode[entry.name] = `$${entry.varName}`;
}

Generator.prototype.getTypeImportLine = function(){
	return `import ${this.typeName} from "${this.typePath}";`;
}

Generator.prototype.getFileImportLines = function(){
	return this.entries.map(function(entry){
		return entry.getImportLine();
	}).join("\n");
}

Generator.prototype.getFileConstLines = function(){
	return this.entries.map(function(entry){
		return entry.getConstLine();
	}).join("\n");
}

Generator.prototype.getTree = function(){
	var json = JSON.stringify(this.tree, null, "\t");
	this.entries.forEach(function(entry){
		json = json.replace(`"$${entry.varName}"`, entry.varName);
	});
	return json;
}

module.exports = Generator;