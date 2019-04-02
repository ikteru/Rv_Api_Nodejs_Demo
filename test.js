// ******************************************************************** //
let realvision = require('./slicer');
let fs = require('fs');
// ******************************************************************** //

//Use this to import the file that you want to slice, the file must have an .rvwj extension.
const rvwjFile = fs.createReadStream("./assets/cubetest.rvwj")

//This is the data you'll be sending with the ProvideFile POST request, feel free to specifiy the configurations you deem fit.

const formData =
{
    file:
    {
        value: rvwjFile ,
        options:
        {
            filename: 'cubetest.rvwj',
            contentType: null
        }
    },
    supportType: 'n',
    printerModel: 'IdeaWerk-Speed',
    configPresetName: 'Recommended',
    configFile: ''
} 

// This function will execute the whole Slicing processing from checking the activation status to Downloading the file and saving it in the "downloads" folder.
//To execute this process, go to your command line interface and cd into this folder, then write: "node test.js", or you can simply execute the npm script by typing: "npm test"

executeFlow(formData);



// ******************************************************************** //
async function executeFlow(formData){

    let activationStatus = realvision.GetActivationStatus();

    if (activationStatus){

        let uniqueID = await realvision.ProvideFile(formData);
        console.log("uniqueID   ::::::: ", uniqueID);
        let progress = 0;
        while ( progress != -1 && progress < 1 ) {
            progress = await realvision.GetProgress(uniqueID);
            console.log("Progress   ::::::: ", progress);
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
