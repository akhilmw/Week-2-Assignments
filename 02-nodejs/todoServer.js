/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");
const path = require("path");
const {v4 : uuidv4} = require('uuid');


const port = 3000;

const app = express();

app.use(bodyParser.json());

var myTodos = []
const folderPath = "./myTodos/"

// Method to fetch all the todos from myTodos folder
var loadMytodos = () => {
  if(!fs.existsSync(folderPath)){
    return myTodos
  }

  let files = fs.readdirSync(folderPath);
  files.forEach((fileName) => {
    const filePath = path.join(folderPath, fileName)
    try {
      if(fileName.endsWith('.json')) {
        let content = fs.readFileSync(filePath, 'utf-8');
        let jsonData = JSON.parse(content)
        myTodos.push(jsonData)
      }
    } catch (error) {
      console.log(`Some error occured while reading files : ${error.message}`)
    }
  })
}
loadMytodos();

// Method to write todo into the folder

var addTodoToFolder = (todoId, todoData) => {
  const filePath = path.join(folderPath, `${todoId}.json`);
  if(fs.existsSync(filePath) && isUpdate){
    fs.writeFileSync(filePath, JSON.stringify(todoData));
  }else{
  fs.writeFileSync(filePath, JSON.stringify(todoData));
  }
}

// method to update data in file
var updateFile = (todoId, todoData) => {
  const filePath = path.join(folderPath, `${todoId}.json`);
  if(fs.existsSync(filePath)){
    fs.writeFileSync(filePath, JSON.stringify(todoData));
  }
}

// method to delete file in Folder
var deleteFile = (todoId) => {
  const filePath = path.join(folderPath, `${todoId}.json`)
  if(fs.existsSync(filePath)){
    fs.unlinkSync(filePath)
  }
}



//  1.GET /todos - Retrieve all todo items
app.get('/todos', (req, res) => {
  console.log(myTodos)
  res.status(200).send(myTodos)
})

// 2.GET /todos/:id - Retrieve a specific todo item by ID
app.get('/todos/:id', (req, res) => {
  const todoId = req.params.id
  let todoWithIdFound = false;
  myTodos.forEach((todo) => {
    if(todo.id === todoId){
      todoWithIdFound = true;
      res.status(200).send(todo)
    }
  })
  if(!todoWithIdFound){
    res.status(404).send(`Todo With id ${todoId} not found, enter a valid Id`)
  }
})

// 3. POST /todos - Create a new todo item
app.post('/todos', (req, res) => {
  newTodoId = uuidv4();
  todoBody = req.body
  todoBody.id = newTodoId
  myTodos.push(todoBody)
  addTodoToFolder(newTodoId, todoBody, false);

  res.status(201).send(`Created a new todo item with ID : ${newTodoId}`)
})


// 4. PUT /todos/:id - Update an existing todo item by ID
app.put('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const todoBody = req.body;
  todoBody.id = todoId
  let todoIdExists = false
  myTodos.forEach((todo) => {
    if(todo.id === todoId) {
      todo.title = todoBody.title;
      todo.completed = todoBody.completed;
      todoIdExists = true;
    }
  })
  if (todoIdExists){
    updateFile(todoId, todoBody);
    res.status(201).send(`Todo updated successfully!!!`)
  }else{
    res.status(404).send(`Todo id not found enter a valid Id`)
  }

})

// 5. DELETE /todos/:id - Delete a todo item by ID
app.delete('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  let todoIdExists = false
  myTodos.forEach((todo) => {
    if(todo.id === todoId) {
      myTodos.splice(myTodos.indexOf(todo), 1)
      todoIdExists = true;
    }
  })
  if (todoIdExists){
    deleteFile(todoId)
    res.status(200).send(`Todo deleted successfully!!!`)
  }else{
    res.status(404).send(`Todo id not found enter a valid Id`)
  }
})

app.use((req, res) => {
   res.status(404).send('Not Found');
})

// app.listen(port, () => {
//   console.log(`App is started at port : ${port}`)
// })

module.exports = app;
