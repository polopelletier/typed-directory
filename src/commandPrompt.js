const compiler = require("./compiler"); 
const watch = require("./watch");

const parser = require("yargs")

	// Usages
	.usage([
		"typed-directory v" + require("../package.json").version,
		"Usage with default config file: typed-directory [-w]",
		"Usage with custom config file:  typed-directory -c <configFile> [-w]",
		"Usage with specific files:      typed-directory -d <sourceDir> -t <typeFile> -o <outFile> [-i][-w]",
		"Usage with watch:               typed-directory -w [-c <configFile>][-d <sourceDir> -t <typeFile> -o <outFile> [-i]]"
	].join("\n"))

	// Config file
	.string("c")
	.alias("c", "configFile")
	.describe("c", "Path to the config file")

	// Source directory
	.string("d")
	.alias("d", "sourceDir")
	.describe("d", "Path to the source directory")

	// Type file
	.string("t")
	.alias("t", "typeFile")
	.describe("t", "Path to the type file")

	// Output
	.string("o")
	.alias("o", "outFile")
	.describe("o", "Path to the output file")

	// Instance
	.boolean("i")
	.default("i", false)
	.alias("i", "instance")
	.describe("i", "Files export instances of the specified type")

	.boolean("w")
	.alias("w", "watch")
	.describe("w", "Recompile every time a file change in the directory")

	// Help
	.help("help");

const argv = parser.argv;

var config;
if(process.argv.length == 2){
	// Use default config
	compiler();
}else if(isDefined(argv.c)){
	// Use custom config
	const loadConfig = require("./config").load;
	config = loadConfig(argv.c);
	if(argv.w){
		watch(config);
	}else{
		compiler(config);
	}
}else{
	var count = 0;
	if(isDefined(argv.d)) count++;
	if(isDefined(argv.t)) count++;
	if(isDefined(argv.o)) count++;

	if(count == 3){
		// Use source directory
		
		const instance = !argv.i;
		
		if(argv.w){
			watch(argv.o, argv.t, argv.d, instance);
		}else{
			compiler(argv.o, argv.t, argv.d, instance);			
		}
	}else if(count > 0){
		if(!isDefined(argv.d)) 
			console.error("Source directory is required");
		if(!isDefined(argv.t)) 
			console.error("Type file is required");
		if(!isDefined(argv.o)) 
			console.error("Output file is required");
	}else if(argv.w){
		// Use watch with default config
		watch();
	}else{
		parser.showHelp();
	}
}

function isDefined(v){
	return v != undefined && v != "";
}