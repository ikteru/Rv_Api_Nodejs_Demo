// ******************************************************************** //
// Imports
// ******************************************************************** //

let realvision = require('./slicer');
let fs = require('fs');
let configs = require('./configs.js');

// ******************************************************************** // 
// ******************************************************************** //

//Use this to import the file that you want to slice, the file must have an .rvwj extension.
const rvwjFile = fs.createReadStream(configs.FILE_TO_SLICE)

//This is the data you'll be sending with the ProvideFile POST request, feel free to specifiy the configurations you deem fit.
const formData =
{
    file:
    {
        value: rvwjFile ,
        options:
        {
            filename: configs.FILENAME,
            contentType: "application/json"
        }
    },
    supportType: configs.SUPPORT_TYPE,
    printerModel: configs.PRINTER_MODEL,
    configPresetName: configs.CONFIG_PRESET_NAME,
    configFile: configs.CONFIG_FILE
} 

//After checking if the token is valid or not using the checkTokenValidity() function
//The executeFlow() function will execute the whole Slicing flow from checking the activation status to Downloading the file and saving it in the "downloads" folder.
//To execute this process, go to your command line interface and cd into this folder, then write: "node test.js", or you can simply execute the npm script by typing: "npm test"
//check() ? realvision.GetActivationStatus() : realvision.getToken().then( ()=> realvision.GetActivationStatus() )

executeFlow(formData) ;

// ******************************************************************** //
// ******************************************************************** //



async function executeFlow(formData){

    let activationStatus = await realvision.GetActivationStatus();

    if (activationStatus){

        let uniqueID = await realvision.ProvideFile(formData);
        let progress = 0;
        while ( progress != -1 && progress != 2 && progress < 1 ) {
            progress = await realvision.GetProgress(uniqueID);
            
            Number.isInteger(progress) ? console.log("Progress   ::::::: ", progress) : progress = 2
        }
        if (progress == 2 ){
            console.log( "Error while fetching progress from server ... ");
        }
        if (progress == 1){
            let printingInformation = await realvision.GetPrintingInformation(uniqueID);
            console.log("Printing Information   : ", printingInformation);
            let result = await realvision.DownloadFile(uniqueID);
            realvision.saveFile("cubetest", result);
        }else if (progress == -1){
            console.log("Error: An error occured while getting the progress of the slicing, please check if the extention of the file used is .rvwj ... ")
        };
    } else {
        console.log("Error: You don't have the necessary rights to call the slicing server.")
    }

}
