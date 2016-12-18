'use strict';
let request = require("request");
let progress = require("request-progress");
let ProgressBar = require("progress");
let fs = require("fs");
let wallpaper = require("wallpaper");
let path = require("path");
let chalk = require("chalk");



function setWallpaper(options){

    if(options.loop != null){
        setTimeout(setWallpaper.bind(null,options),options.loop*1000);
    }

    let configPath = path.join(__dirname,"../wallaper-config.json");
    
    if(options.config){
        let lastConfig;
        if(fs.existsSync(configPath)){
            lastConfig = require(configPath);
        }else{
            console.error(chalk.red("Configuration was not found."));
            process.exit(0);
        }
        options = lastConfig;
    }

    let url = "https://source.unsplash.com/";

    switch(options.mode){

        case "search":

            url += "/"+options.width+"x"+options.height;
            url += "?"+options.value;

        break;

        case "likes":

            url += "user/"+options.value+"/likes";
            url += "/"+options.width+"x"+options.height;


        break;

        case "photo":

             url += options.value;
             url += "/"+options.width+"x"+options.height;


        break;

        case "random":

            url += "random/"+options.width+"x"+options.height;

        break;
        case "collection":
        case "category":

            url += options.mode+"/"+options.value;
            url += "/"+options.width+"x"+options.height;

        break;

        default:

            console.error(chalk.red("Invalid mode. Please use one of the following: collection, likes, user, category, photo, random"));

        break;
    }


    console.log(chalk.green("Downloading...: "+url));

    var outPath = path.join(process.cwd(), "./wallpaper.jpg");

    var bar = new ProgressBar('[:bar]', {
        total: 100
    });


    progress(request(url), {
        throttle: 20, 
        lengthHeader: 'x-transfer-length'
    }).on("progress", function(data) {

        bar.tick(parseInt(data.percentage));




    }).on("end", () => {
        console.log("\n");
        if (options.desktop) {
            console.log(chalk.green("Setting as wallpaper..."));
            wallpaper.set(outPath).then(function() {
                console.log(chalk.green("Applied wallpaper"));
            }).catch((err) => {
                console.log(err);
            });

        } else {
            console.log(chalk.green("Skipping setting as wallpaper..."));
        }
    })

    .pipe(fs.createWriteStream(outPath))



    fs.writeFileSync(configPath,JSON.stringify(options))

}


module.exports = setWallpaper;
