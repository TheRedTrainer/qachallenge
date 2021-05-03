# qachallenge
QA Coding Challenge

Prerequisites: 
- Chrome
- git
- npm 
- cypress
- chromedriver

The code for the automation challenge was developed using Cypress, so the following steps are required in order to execute the tests

1. Check that you have chrome, git, npm, cypress and chromedriver installed. If you don't have these dependencies, you need to install first chrome, git and npm, then follow the steps defined on https://docs.cypress.io/guides/getting-started/installing-cypress#System-requirements to install **cypress** and also execute the following command

`npm install chromedriver --save-dev` 

2. Once you have all the dependencies, you need to clone the qachallenge project with the following command

`git clone https://github.com/TheRedTrainer/qachallenge`

3. Go to the project directory and then, according to your OS, you need to execute the following cypress command

Windows 
`C:\\full-path-to-cypress-cmd\cypress.cmd run --env mexMail=#MEXMAIL,argMail=#ARGMAIL,usrPwd=#PASSWORD --config-file "cypress.json" --browser chrome`

Linux 
`\full-path-to-cypress\cypress run --env mexMail=#MEXMAIL,argMail=#ARGMAIL,usrPwd=#PASSWORD --config-file "cypress.json" --browser chrome`


where **#PASSWORD** is the password that will be defined for the bitso test users (a valid working password that could be used is "Password-5Tacos") and **#MEXMAIL** and **#ARGMAIL** are both temporal mails that you should have access to the inbox in order to check the verification codes that are sent during the automated test, because it is needed to ingress that data manually.

I suggest to open  https://temp-mail.org in two private session from different browsers in order to get valid mail addresses that you can check their inbox.

All the env variables should be enclosed by "" like mexMail="mex@example.com", argMail="arg@example.com", usrPwd="Password". You also need to be sure that cypress.json and bitso.js are located on the same folder. Finally, check that the path to cypress.cmd is correct, usually is located (if you are using windows) on C:\Users\#username\node_modules\.bin\cypress.cmd


Now the automated test should start running and you should stay alert for the moment in which the bitso page asks for the verification codes for user registration. The flow will continue and the test will end


Troubleshooting 

- If there is an issue when you try to click the button to confirm the user registration and a "Too many request" warning is displayed, please try to use a VPN to change your IP, allowing in that way that the test keeps running. 



