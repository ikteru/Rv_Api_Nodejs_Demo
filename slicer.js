//Imports //
let fs = require('fs')
let request = require('request')
let configs = require('./configs')
require("dotenv").config()

//Global Variables
const baseUrl = process.env.API_LINK;


//The HTTP Request functions: all these functions accept at most one parameter: 
//      either the formData object which contains the file to slice and its configurations, or the uniqueID of the slicing job.
//      or no parameter at all in GetActivationStatus's case

module.exports.GetActivationStatus = async function () {
    let formData = {};
    return await module.exports.initializeRequest("POST", baseUrl, "GetActivationStatus", formData);
}

module.exports.ProvideFile = async function (formData) {
    return await module.exports.initializeRequest("POST", baseUrl, "ProvideFile", formData);
}

module.exports.GetProgress = async function (id) {
    const formData = { uniqueID: id };
    return module.exports.initializeRequest("POST", baseUrl, "GetProgress", formData);
}

module.exports.GetPrintingInformation = async function (id) {
    const formData = { uniqueID: id };
    return module.exports.initializeRequest("POST", baseUrl, "GetPrintingInformation", formData);
}

module.exports.CancelSlicing = async function (id) {
    const formData = { uniqueID: id };
    return module.exports.initializeRequest("POST", baseUrl, "CancelSlicing", formData);
}

module.exports.DownloadFile = async function (id) {
    const formData = { uniqueID: id };
    return await module.exports.initializeRequest("POST", baseUrl, "DownloadFile", formData);
}

//



//This functions saves the file in the downloads folder. 
//It is used right after the the DownlaodFile function is executed and returns the response

module.exports.saveFile = function (filename, result) {
    const fullname = filename + "." + Date.now() + ".fcode";
    const file = fs.createWriteStream(configs.DOWNLOADS_FOLDER + fullname);
    file.write(result);
    file.end();
    console.log("File saved successfully in the Downloads folder under the name ::::: ", fullname);
}

//Check if we have a token file or not, if we do, check if it's valid or not
module.exports.checkTokenValidity = function () {
    let token = {};

    try {
        token = require("./token.json");

    } catch{
        console.log("Error retrieving token from : " + process.env.TOKEN_PATH);
        return false
    }

    if (token.expires_on == "") {
        console.log("Error while retrieving token expiry date from : "  + process.env.TOKEN_PATH)
        return false;
    }
    else if (Date.now() / 1000 < token.expires_on) {
        return true;
    }

    return false;
}

//Get token first 

module.exports.getToken = function () {


    const formData = {
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        resource: "https://api.createitreal.com/"
    }

    const options = {
        method: "GET",
        url: process.env.AUTHORIZATION_SERVER_URL,
        formData: formData
    }

    const writeFile = (path, data, opts = 'utf8') =>
        new Promise((resolve, reject) => {
            fs.writeFile(path, data, opts, (err) => {
                if (err) reject(err)
                else resolve()
            })
        })

    if (this.checkTokenValidity()) {
        const token = require(configs.TOKEN_PATH);
        return new Promise(function (resolve, reject) {
            // Make the http request using the lightweight "request" library
            request(options, function (err, resp, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(token.access_token);
                }
            })
        });
    } else {
        return new Promise(function (resolve, reject) {
            // Make the http request using the lightweight "request" library
            request(options, function (err, resp, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            })
        }).then(
            result => {
                writeFile(configs.TOKEN_PATH, result, function () {
                    console.log("TOKEN SUCCESSFULLY SAVED")
                })
                const temp = JSON.parse(result);
                return temp.access_token;
            }

        )
    }

}

//This is the function you call in order to execute the HTTP requests,
//all the functions above use this function.
module.exports.initializeRequest = async function (method, baseUrl, serviceCall, formData) {
    //Getting token 
    const TOKEN = await this.getToken()
    // Setting URL and headers for request
    let options = {
        method: method,
        url: baseUrl + "/" + serviceCall,
        followAllRedirects: true,
        headers: {
            'Authorization': TOKEN,
            'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY,
        },
        formData: formData
    }

    if (serviceCall == "GetActivationStatus") {
        delete options["formData"];
    }

    // Return new promise 
    return new Promise(function (resolve, reject) {
        // Make the http request using the lightweight "request" library
        request(options, function (err, resp, body) {
            console.log(" ************************************************************************************** ");
            console.log("   Full URL        ::::: " + options.url);
            console.log("   NEW TOKEN?      ::::: " + !module.exports.checkTokenValidity());
            if (err) {
                reject(err);
            } else {

                console.log("   Status code of  ::::: " + serviceCall + "   ::::: is ::::: " + resp.statusCode);
                if (resp.statusCode !== 500) {
                    resolve(body);
                    console.log("   Result of       ::::: " + serviceCall + "   ::::: is ::::: " + body);
                } else {
                    resolve(resp.statusCode)
                }

            }
            console.log(" ************************************************************************************** ");
        })
    })
}
