#!/usr/bin/env node --harmony
'use strict';
var program = require('commander');
let defaults = require("./defaults");
let chalk = require("chalk");
let setWallaper = require("./index");

program
    .version(require("../package.json")["version"])
    .arguments("<mode> [value]")
    .action(function(mode, value) {
        program.mode = mode;
        program.value = value;
    })
    .option("-s --save", "Save picture to current directory")
    .option("-c --config","Use the last used parameters")
    .option("-d --desktop", "Set as desktop wallpaper")
    .option("-w --width <n>", "Set the desired width", parseInt)
    .option("-l --loop <n>", "Loop every n seconds", parseInt)
    .option("-h --height <n>", "Set the desired height", parseInt)

program.parse(process.argv);


let input = {
	save: program.save == true,
	desktop: program.desktop == true,
	config: program.config == true,
	width: program.width != null ? program.width : defaults.width,
	height: program.height != null ? program.width : defaults.height,
	mode: program.mode,
	value: program.value,
	loop: program.loop
};

if(input.mode == null && !input.config){

	console.error(chalk.red("Can not proceed without a mode!"));
	process.exit(0);

}


setWallaper(input);
