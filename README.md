# Frugal Friend

Due to the extended use of credit cards and online payments, it becomes harder to keep track of expenses and save money. People need an app where they can track their expenses and keep some amount aside for savings, but few find this an easy task. With this motive, our application provides a  simple and user-friendly interface that makes it easy to input your income and expenses throughout the month, set monthly budget goals, and see your budget progress change in real-time as the month progresses with custom-made charts.

This repository holds project code for CS-554 final project
### Group Name: Hawk
### Group member:
1. Adam Anikiej
2. Wei Guo
3. Qing Mei
4. Parth Paghdal
5. Peixuan Wu

This web app is written using 2 different Javascript framework and few other independent technology
1. Node.js
2. React
3. Firebase Authentication
4. Redis
5. Docker
6. ImageMagick

## Which code is where?
The root directory of our codebase has code for backend and frontend. Under the root directory, one can find code for frontend and nder the directory name backend, one can find code related to the backend only.

## Prerequisite for this web application.
In order to run this app successfully you need to install few software prior to running this app, and those softwares are
- Redis
- Docker
- Imagemagick
- MongoDB and of course
- Node.js

### How to install redis on my device?
Here is the official documentation from the redis to install it on your device https://redis.io/docs/getting-started/installation/. Please follow this link and download it on your device.

### How to install Docker on my device?
Here is the official documentation from the Docker to install it on your device https://docs.docker.com/get-docker/. Please follow this link and download it on your device.

#### For mac users
- Download the .dmg file according to your PC configuration from this link https://docs.docker.com/desktop/install/mac-install/.
- Double click on downloaded .dmg file and install that into your PC.
- Finish installation and run newly installed docker.

#### For window users
- Download the .exe file according to your PC configuration from this link https://docs.docker.com/desktop/install/windows-install/.
- Double click on downloaded .exe file and install that into your PC.
- Finish installation and run newly installed docker.

### How to install Imagemagick on my device?
Here is the official documentation from the ImageMagick site to install it on your device https://imagemagick.org/script/download.php. Please follow this link and download imagemagick based on your PC OS and make sure you are downloading the lateset version of Imagemagick, which is 7.1.1.

### How to install MongoDB on my device?
Here is the official documentation from the MongoDB site to install it on your device https://www.mongodb.com/try/download/community. Please follow this link and download MongoDB on your device.

- Once you hit above URL it will bring you to the download page of MongoDB.
- Scroll down to the MongoDB Community edition and then open MongoDB community server.
- By default it will select plateform and package based on your PC OS. but make sure you are downloading the correct installation file.
- After successful download, install that downloaded package and finish setup.

### How to install Node.js on my device?
Here is the official documentation from the Node.js site to install it on your device https://nodejs.org/en/download. Please follow this link and download Node.js on your device.

- Once you hit above URL it will bring you to the download page of Node.js
- Make sure you have selected LTS(Long Term Support) version for Node.js and download installation file according to your PC OS.
- After successful download, install that downloaded package and finish setup.

### How to run application?
- Open the code in VS Code or choice of your text editor.
- Now start redis server so our redis client in backend can interact with it.
- Now open integrated terminal in VS code or open project in terminal/command prompt.
- Now navigate to backend folder using `cd backend`
- After chanding directory, hit `npm install` command to install all neccasary library to run the backend.
- Once installation of library is done hit `npm run seed` command to add initial data to backend db.
- Once seeding is done hit `npm start` command to start our backend server.
- Now wait for few seconds until you not show message like "Your server is running at http://localhost:4000". Once you see this message it means our server is running now.
- Now our backend is started successfully, its time to start frontend as well. To do so, please open integrated terminal in VS code or open project in terminal/command prompt.
- Now hit `npm install` command to install all neccasary library to run the application.
- It will take few minutes to download all library.
- Once downloading of all library is done, hit `npm start` command to start frontend.
- it will take few minutes to start frontend and you can see in browser window as well.
- http://localhost:3000/ is the main page of app but you can login here http://localhost:3000/auth/login.

### How to run application using Docker?
- To run application using Docker, you must start Docker application in your local machine
- Once your docker is running, please open integraed terminal in VS code or open project in termianl/command propmpt.
- After opening project, hit `docker system prune` command to clear all existing container for a fresh start.
- Once you get the result of above command hit `docker-compose up` command to run application. At very first time it will take some time(around 5 minutes) in order to install images for the container.
- Above command will do everything for you like installing all node dependancy, seeding database, starting backend server and frontend. One thing that it don't do is starting app in browser. So for that you have to manually call http://localhost:3000/ in browser when docker container is running. You will see message like normal run.

## Credential of some already created account
Please note you can login with this account only if have run seed file in backend.

<table>
    <thead>
        <tr>
            <td>Email</td>
            <td>Password</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>regina.pratt12@gmail.com</td>
            <td>REgina@123$</td>
        </tr>
        <tr>
            <td>shirley.farmer@farm.com</td>
            <td>iLoVeCaT@36</td>
        </tr>
        <tr>
            <td>ted123@teddy.com</td>
            <td>IlOvEdOgS@63</td>
        </tr>
        <tr>
            <td>pricillaroberson@outlook.com</td>
            <td>iHATEBEINGHERE$685</td>
        </tr>
        <tr>
            <td>vanellis@yahoo.com</td>
            <td>Password@000</td>
        </tr>
        <tr>
            <td>beckyschwartz@gmail.com</td>
            <td>NUllStory$90</td>
        </tr>
    </tbody>
</table>

## To view email budgets that are sent to use from budget page
go to https://ethereal.email/
go to login

email: drake89@ethereal.email
password: MmWReUxfnUfsGxKe2U

Once logged in, click messages to view emails

## Github Repository Link
https://github.com/parth-paghdal-132/frugal-friend
