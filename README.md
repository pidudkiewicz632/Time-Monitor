# Time-Monitor

## About
An application that allows you to monitor the working time of employees.

### Functions
* adding, removing and editing working time
* single and all user statistics
* adding, editing and removing users using cli

### Technologies
Project is created with:
* [Vue 2.0](https://vuejs.org/)
* [Vuex](https://vuex.vuejs.org/)
* [Vuetify](https://vuetifyjs.com/en/)
* [Express JS](https://expressjs.com/)
* [Passport JS](https://www.passportjs.org/)
* [Mongoose JS](https://mongoosejs.com/)
* [Nuxt JS](https://nuxtjs.org/)
## Setup
### Environment variables
```
DB_ADRESS = 'mongodb adress'
HOST = 'host adress'
PORT = port
BASE_URL = 'url' 
```
Example
```
DB_ADRESS = 'mongodb://localhost:27017'
HOST = '192.168.0.10'
PORT =  8000
BASE_URL = 'http://192.168.0.10:8000/'
```
### Build App
```bash
# Go to time folder
$ cd time

# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

### Install CLI
```bash
# Go to cli folder
$ cd cli

# install dependencies
$ npm install

# install cli
$ npm link

```

### Using CLI
```bash
# Adding User
$ timeMonitor addUser name surname login password --type admin|user

# Editing User
$ timeMonitor updateUser login --name newName --surname newSurname --password newPassword --type newType --login newLogin

# Removing User
$ timeMonitor updateUser login --type deleted
```

### Demo
https://timemonitorapp.herokuapp.com/  

#### Test account
Login: test123  
Password: 1Testowy.

### Contact
Created by pidudkiewicz632 (pidudkiewicz932@gmail.com).