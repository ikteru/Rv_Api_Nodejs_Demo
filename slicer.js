
//Imports //
let fs = require('fs');
let request = require('request')
require("dotenv").config();

//Global Variables
const baseUrl = process.env.API_LINK;



module.exports.GetActivationStatus = async function() {
    let formData = {};
    return await module.exports.initializeRequest("POST", baseUrl, "GetActivationStatus", formData);
}

module.exports.ProvideFile = async function(formData) {
    return await module.exports.initializeRequest("POST", baseUrl, "ProvideFile", formData);
}

module.exports.GetProgress = async function(id) {
    const formData = { uniqueID: id };
    return module.exports.initializeRequest("POST", baseUrl, "GetProgress", formData);
}

module.exports.GetPrintingInformation = async function (id){
    const formData = { uniqueID: id };
    return module.exports.initializeRequest("POST", baseUrl, "GetPrintingInformation", formData);
}

module.exports.DownloadFile = async function (id) {
    const formData = { uniqueID: id };
    return await module.exports.initializeRequest("POST", baseUrl, "DownloadFile", formData);
}

module.exports.saveFile = function (filename, result){
    const fullname = filename + "." + Date.now() + ".fcode";
    const file = fs.createWriteStream(`./downloads/${fullname}`);
    file.write(result);
    file.end();
    console.log("File saved successfully in the Downloads folder under the name ::::: ", fullname);
}

module.exports.initializeRequest = function (method, baseUrl, serviceCall, formData) {
    // Setting URL and headers for request
    let options = {
        method: method,
        url: baseUrl + "/" + serviceCall,
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY,
            //'content-type': 'multipart/form-data'
        },
        formData: formData
    }
    // Return new promise 
    return new Promise(function (resolve, reject) {
        // Do async job
        request(options, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                console.log("Status code of ::::: " + serviceCall + "::::: is ::::: " + resp.statusCode);

                if(resp.statusCode !== 500 ){
                    resolve(body);
                } else {
                    resolve(resp.statusCode)
                }
                
            }
        })
    })
}
