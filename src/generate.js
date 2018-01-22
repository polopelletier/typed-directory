const path = require("path");

const Generator = require("./Generator");
const scan = require("scan-dir-recursive/sync");

module.exports = function(sourceDir, typeFile, outputFile, instance = true){
	const outputDir = path.parse(outputFile).dir;

	const generator = new Generator(sourceDir, outputDir);
	generator.setType(typeFile, instance);

	scan(sourceDir, function(files){
		files.forEach(function(filename){
			generator.addFile(filename);
		})
	});

	return exportToFile(generator);
}

function exportToFile(generator){
	var content = generator.getTypeImportLine();
	content += "\n\n"

	content += generator.getFileImportLines();
	content += "\n\n"

	content += generator.getFileConstLines();
	content += "\n\n"

	content += "export default ";
	content += generator.getTree();
	content += ";";

	return content;
}