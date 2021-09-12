# Employee Tracker

![badmath](https://img.shields.io/badge/License-MIT-informational)

## Description

This employee tracker is a solution for anyone wanting to keep track of basic information pertaining to their employees. This command line application is in its first iteration currently and there are plans to make it more robust with a few more features in the future.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Languages / Frameworks](#languages)
* [Dependancies](#dependancies)
* [Roadmap](#roadmap)


## Installation

Currently, to run this project you must first clone the files from github to your local machine. You must ensure that you have node.js installed as
well as MySql server setup with a username and password. After the files, and associated programs are installed you must navigate to the command line and run ```npm install``` to download the required node packages to run this application. After that you must create a .env file in the root directory with the correct variables using the username and password that you use for your MySql server. Lastly, login to mysql on the command line from the root folder and run ```source db/schema.sql``` followed by ```source db/seeds.sql```. This will ensure that you have the proper setup to use the application.

## Usage

After all dependacies are installed on your computer, open the command line and navigate to the root directory that contains app.js. While there run ```npm start```. This will begin the program and you will be greeted with the top menu. From here you can manage the database (see roadmap below) and also enter the main menu. While on the main menu you will be shown multiple options. For each one you choose follow the prompts that are shown to use the application. A video demonstration can be found [here](https://drive.google.com/file/d/1nB7XridCWur044V42qZpnXaNr2kQmJ9w/view).

## License

This project is current licensed under the [MIT](LICENSE) license.

## Languages / Frameworks

* Javascript
    * node.js

## Dependancies

* inquirer
* mysql2
* dotenv
* console.table

## Roadmap

This app is currently quite basic but I plan on adding a handful of features in the future which include:

    * Incorporating an embedded database to help make the application stand alone
    * Allowing the user to customize the database as they need
    * Fix various bugs that will be added to the issues for this repository
    * Any other features to be added will be included here
