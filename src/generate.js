const fs = require("fs");
const path = require("path");

const Generator = require("./Generator");
const scan = require("scan-dir-recursive/sync");

const IGNORE_FILE_REGEXP = /\/\*\s?(typed-directory)\s?(ignore)\s?\*\//;

module.exports = function(sourceDir, typeFile, outputFile, instance/* = false*/){
	if(instance == undefined) instance = false;
	
	if(!fs.existsSync(sourceDir)){
		throw new Error(`Source directory doesn't exist './${sourceDir}'`);
	}

	if(!fs.existsSync(typeFile)){
		throw new Error(`Type file doesn't exist './${typeFile}'`);
	}

	const outputDir = path.parse(outputFile).dir;

	const generator = new Generator(sourceDir, outputDir);
	generator.setType(typeFile, instance);

	scan(sourceDir, function(files){
		files.forEach(function(filename){

			if(path.extname(filename) != ".ts"){
				// Not typescript, ignore it
				return;
			}

			// Test for ignore header
			const content = fs.readFileSync(filename).toString().split("\n");
			if(IGNORE_FILE_REGEXP.test(content[0])){
				// Ignore that file
				return;
			}

			generator.addFile(filename);
		});
	}, [
		typeFile,
		outputFile
	]);

	return exportToFile(generator);
};

function exportToFile(generator){
	var content = generator.getTypeImportLine();
	content += "\n\n";

	content += generator.getFileImportLines();
	content += "\n\n";

	content += generator.getFileConstLines();
	content += "\n\n";

	content += "export default ";
	content += generator.getTree();
	content += ";";

	return content;
}