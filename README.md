# REALvision Online

This project is a quick start Nodejs project to let you easily slice REALvision workstation files online.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You'll need to have Nodejs installed on your computer. You'll also need "Git" installed.

### Installing

A step by step series of examples that tell you how to get a development env running:

Download the project to your computer by using the green "Clone & Download" button, or by executing:
```
git clone https://github.com/ikteru/realvision_api.git
```
Go into the realvision_api folder you just downloaded and execute the following command:

```
npm install
```
This will install all the dependencies needed for the project to run.

Now that you're set up. The next step is to change the Subscription key in the ".env" file. 
And while you're at it, change the ``` CLIENT_ID ``` and ``` CLIENT_SECRET ``` to your own.

Once you've done that, go to the ``` configs.js ``` file to set the file you want to slice and where the result fcode will be stored.
You can also change the configs of the slicing job like the printer model, the support type or even specify your own custom configs.

## Running the slicing flow

Now that everything is in order, all you need to do is execute: 
``` ```
``` npm test ```
``` ```
or:

``` ```
``` node test.js ```
``` ```
What the commands above do is that they call the API using your subscription key, send the file you want to slice and download the result fcode file then store it in the downloads folder.
You'll see some logs pop up in the CLI showing the progress of the slicing job.
