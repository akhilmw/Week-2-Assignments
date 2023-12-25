/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const {v4 : uuidv4} = require('uuid');
const bodyParser = require("body-parser")
const dotenv = require('dotenv'); 
const jwt = require('jsonwebtoken');

const PORT = 3000;

const app = express();
dotenv.config();

app.use(bodyParser.json())

// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

var users = []


//  1. POST /signup - User Signup
app.post('/signup', (req, res) => {
  let email = req.body.emailId;
  let pwd = req.body.password;
  let fName = req.body.firstName;
  let lName = req.body.lastName

  let userExists = false;
  users.forEach((user) => {
    if(user.email === email){
      userExists = true;
    }
  })

  if(!userExists){
    const userId = uuidv4();
    const userObj = {id : userId, emailId: email, password: pwd, firstName: fName, lastName: lName};
    users.push(userObj);
    res.status(201).send("User Created Successfully!!");
  }else{
    res.status(400).send("User already exists!!");
  }

})

// 2. POST /login - User Login

app.post('/login', (req, res) => {
  let email = req.body.emailId;
  let pwd = req.body.password;

  users.forEach((user) => {
    if(user.emailId === email){
      if(user.password === pwd){
        const data = {
          time : new Date(),
          userId : user.id
        }
        const jwtSecretKey = process.env.JWT_SECRET_KEY
        const token = jwt.sign(data, jwtSecretKey)
        res.status(200).send(token)
      }else{
        res.status(404).send("Invalid Credentials!!")
      }
    }
  })


})

// 3. GET /data - Fetch all user's names and ids from the server (Protected route)


var getUserDetails = () => {
  const modifiedData = users.map(({ password, ...userDetails }) => (userDetails));
  return {usersData : modifiedData};
}


app.get('/data', (req, res) => {
  console.log(req.headers)
  let email = req.headers['emailid']
  let pwd = req.headers['password']
  console.log(`${email}, ${pwd}`)

  users.forEach((user) => {
    if(user.emailId === email){
      if(user.password === pwd){
        const data = getUserDetails();
        res.status(200).send(data)
      }else{
        res.status(404).send("Invalid Credentials!!")
      }
    }
  })
})


app.use((req, res) => {
  res.status(404).send("Not Found");
})



app.listen(PORT, () => {
  console.log(`App started at port : ${PORT}`)
})

module.exports = app;





