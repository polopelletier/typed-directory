const fs = require("fs");
const path = require("path");

function getRootDir(name){
	return path.resolve(process.cwd(), "examples", name);
}
module.exports.getRootDir = getRootDir;


module.exports.getPaths = function(dir, type){
	const rootDir = getRootDir(dir);
	return {
		rootDir: rootDir,
		content: path.resolve(rootDir, "content"),
		type: path.resolve(rootDir, type)
	};
}


function getOutputPath(dir){
	return path.resolve(dir, "provided.ts");
}
module.exports.getOutputPath = getOutputPath;


function loadExpected(rootDir){
	const fullname = path.resolve(rootDir, "output.ts");
	return fs.readFileSync(fullname).toString();
}
module.exports.loadExpected = loadExpected;


function loadProvided(rootDir){
	const fullname = getOutputPath(rootDir);
	assert.isTrue(fs.existsSync(fullname), `Expected '${fullname}' to have been outputed`);
	return fs.readFileSync(fullname).toString();
}
module.exports.loadProvided = loadProvided;


function trimHeader(content){
	return content.split("\n").slice(1).join("\n");
}
module.exports.trimHeader = trimHeader;

function assertFileMatch(provided, expected, message){
	assert.isString(provided, "Expected result to be a String");

	assert.equal(provided, trimHeader(expected), message);
}
module.exports.assertFileMatch = assertFileMatch;


module.exports.compareFiles = function(dir){
	const rootDir = getRootDir(dir);

	const provided = loadProvided(rootDir);
	const expected = loadExpected(rootDir);

	assertFileMatch(trimHeader(provided), expected);
}