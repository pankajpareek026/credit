
# Credit                                                                                  

This is a powerful and user-friendly web-based application designed to effortlessly track transactions between friends and families, while also simplifying personal finance management. With its intuitive interface, interactive features.

[Live](https://creditc.vercel.app/)

# test user

 email : credit@gmail.com  
 password : 1234#@New


## Run Locally

Clone the project

```bash
  git clone git@github.com:pankajpareek026/credit.git
```

Go to the project directory

```bash
  cd credit
```

## Install dependencies
### 1. install dependencies for Fronted
```bash
npm install
```
### 2. install dependencies for Backend

```bash
  cd api
  npm install
```

## Start both  servers (react & node)

```bash
  npm run start

  //open new tab and start backend server

  cd api
  npm run start
```

# Change Database configration at api/db/config.js

```javascript
const mongoose = require('mongoose')
const url = <your connection string>

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(url, connectionParams).then((e) => {
    // console.log(e)
    console.log("DB > connected")
}).catch((ee) => {
    console.info("ERR: ", ee)
}) 
```


# Screenshots
**Home page**

![App Screenshot](https://i.ibb.co/rQqVY0k/home.png)


**DashBoard**

![DashBoard](https://i.ibb.co/Vx50X2x/dashboard.png)

**Add Transaction**

![Add Transaction](https://i.ibb.co/wMJ7v9H/Add-transaction-Page.png)


**Transactions Detail**

![Transaction Detail](https://i.ibb.co/YysqfQc/detail-page.png)


**Share Transaction Detils Page**

![Transaction Detail](https://i.ibb.co/7pNDg8D/shared-t.png)





## Tech Stack

**Client:** ReactJS  
**Server:** NodeJS, ExpressJS   
**Database:** MongoDB 



