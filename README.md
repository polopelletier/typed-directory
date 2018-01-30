# Typed directory

[![NPM version](https://badge.fury.io/js/typed-directory.svg)](http://badge.fury.io/js/typed-directory)

`typed-directory` is a utility that will generate a strongly typed hierarchy of a specific folder. It is useful for typescript projects that need dynamic imports but don't want to give-up type annotation.

## Installation
```bash
# Install globally
npm install -g typed-directory

# or
# Add to your own module
npm install --save-dev typed-directory
```

## Usage
Basic usage takes an input directory and a typescript file and output a hierarchy of the file.

```bash
typed-directory -d examples/classes/content -t examples/classes/BaseClass.ts -o examples/classes/output.ts
```

## Configuration file

### Format
The configuration file must export an `Array` of `Object`. 

Each object represents a directory that needs to be compiled and must have the following keys:
- `dir:String` - Path to the directory containing your source files (relative to project root)
- `type:String` - Path to the typescript file exporting the type description of all files contained in the source directory (relative to project root)
- `output:String` - Path to the typescript file that must be generated (relative to project root)
- `[instance:Boolean]` _(Optional: default=false)_ - See section [is instance](#is-instance)


```javascript
// typed-directory.config.js
module.exports = [
	{
		dir: "examples/classes/content",
		type: "examples/classes/BaseClass.ts",
		output: "examples/classes/output.ts"
	}
];
```

__Note__: It is also possible to use __json__ format for your config file.

### Default config
While it is possible to specify your own config filename, it is recommended to use the default config. 

It must be named `typed-directory.config.js` (or `.json`) and be located at the root of your project (with `package.json`).

## Command-line tool
```bash
# Use default config
typed-directory

# Use specific config
typed-directory -c examples/config/typed-directory.config.json

# Use specified path
typed-directory -d examples/classes/content -t examples/classes/BaseClass.ts -o examples/classes/output.ts

# Print the full documentation for the command-line tool
typed-directory --help
```

## Use as a module
`typed-directory` can also be used as a standard node module.

```javascript
const compiler = require("typed-directory");

// Run with default config
compiler();
```

### Parameters

#### compiler()
Run compiler using default config file

#### compiler(configFilename)
Run compiler using a custom config file
- `configFilename:String` - Path to the configuration file (relative to project root)

#### compiler(outputFilename, typeFilename, contentDirectory[, isInstance=false])
Run compiler by specifying the paths for one entry
- `outputFilename:String` - Path to the typescript file that must be generated (relative to project root)
- `typeFilename:String` - Path to the typescript file exporting the type description of all files contained in the source directory (relative to project root)
- `contentDirectory:String` - Path to the directory containing your source files (relative to project root)
- `[isInstance:Boolean]` _(Optional: default=false)_ - See section [is instance](#is-instance)

#### compiler(entries)
Run compiler by specifying the paths for multiple entries
- `entries:Array` - List of entries
- `entries[n].dir:String` - Path to the directory containing your source files (relative to project root)
- `entries[n].type:String` - Path to the typescript file exporting the type description of all files contained in the source directory (relative to project root)
- `entries[n].output:String` - Path to the typescript file that must be generated (relative to project root)
- `[entries[n].instance:Boolean]` _(Optional: default=false)_ - See section [is instance](#is-instance)


## Watch
It is also possible to watch the source directory and the type file for change and recompile when any.

Source watching is available in command-line or module mode.

### Command-line
Add the `-w` or `--watch` flag to your command. 

See [command-line tool section](#command-line-tool) for more information on how to use the command-line tool.

```bash
# Watch using default config
typed-directory -w
```

### Module
Load the `/watch` module instead of the default one. The parameters are the same as the usual compiler. 

See [use as a module](#use-as-a-module) for more information on how to use it as a module.

```javascript
const compiler = require("typed-directory/watch");

// Run with default config
compiler();
```

## Using with third-party libraries

### Nodemon
Integrating `typed-directory` with `nodemon` can be done by adding a start event in your `nodemon.json` and calling the [command-line tool](#command-line-tool) in it. 

It is good practice to add your `output` files to the ignore list (otherwise `nodemon` will be stuck in an perpetual compilation loop).

Just remember that you __DON'T__ need the `--watch` flag since `nodemon` already take care of all the watching of files.

```javascript
{
	"events": {
		// Using the default config
		"start": "typed-directory"
	},
	"ignore": [
		// NOTE: Adding all output files here is good practice (to avoid perpetual compilation loop)
	],
	// The rest of your nodemon.json is up to you...
}
```



### Webpack
(In development)

## Is instance

### Import content as sub-classes (default)
Use `isInstance=false` if the source files export a class that __extends__ the specified type

__Example:__ Type is `{new(): BaseClass}`, therefore `Something` is a class that __extends__ `BaseClass`
```typescript
import BaseClass from "./BaseClass";

import _Something from "./content/Something";

// Casting as sub-class of BaseClass
const Something:{new(): BaseClass} = _Something;

export default {
	"Something": Something
};
```

### Import content as instances 
Use `isInstance=true` if the source files export an __instance__ of the specified type

__Example:__ Type is `Animal`, therefore `cat` is an __instance__ of `Animal`
```typescript
import Animal from "./Animal";

import _cat from "./content/domestic/cat";

// Casting as instance of Animal
const cat:Animal = _cat;

export default {
	"domestic": {
		"cat": cat
	}
};
```

## Tests
The tests can be run by using the test command:
```bash
npm run test
```

Coverage data can also be generated by running the coverage command:
```bash
npm run coverage
```