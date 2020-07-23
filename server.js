const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '$anggami@23sql',
    database : 'smartbrain'
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res)=> {
  res.send(db.users);
})

app.post('/signin',signin.handleSignin(db,bcrypt) )

app.post('/register',(req,res)=>{register.handleRegister(req,res,db,bcrypt)})

app.get('/profile/:id', (req,res)=>{profile.handleProfileGet(req,res,db)})

app.put('/image',(req,res)=>{image.handleImage(req,res,db)})

app.post('/imageurl',(req,res)=>{image.handleApiCall(req,res)})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})




// const express = require('express');
// const bodyParser = require('body-parser'); // to use request.body
// const bcrypt = require('bcrypt-nodejs'); // secure password using bcrypt -> hash
// const cors = require('cors');// this is used since we get ' access-controll-allow-origin' in chrome as chrome think the server gets in is not secure its a hack
// const knex = require('knex')// db connectivity

// // get code from knex.js
// const db = knex({
//   client: 'pg', // making client as postgres
//   connection: {
//     host : '127.0.0.1', // same as local host
//     user : 'postgres',
//     password : '$anggami@23sql',// no pwd for db
//     database : 'smartbrain'
//   }
// });


// const app = express();

// // we need to access the below 'use' once the app = express is created

// app.use(cors())
// // to use bodyparser bcuz its a middleware
// app.use(bodyParser.json());

// app.get('/', (req, res)=> {
//   res.send(db.users);
// })

// //for signin
// app.post('/signin', (req, res) => {
//   db.select('email', 'hash').from('login')
//     .where('email', '=', req.body.email)
//     .then(data => {
//       const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
//       if (isValid) {
//         return db.select('*').from('users')
//           .where('email', '=', req.body.email)
//           .then(user => {
//             res.json(user[0]) // res.json is as like res.send => but res.json gives more working with json
//           })
//           .catch(err => res.status(400).json('unable to get user'))
//       } else {
//         res.status(400).json('wrong credentials') // mention not a user wrong value is used
//       }
//     })
//     .catch(err => res.status(400).json('wrong credentials')) 
// })

// // for register
// app.post('/register', (req, res) => {
//   const { email, name, password } = req.body; // req.body -> is used since we need ti further chech in signin whether the user is available or not
//   const hash = bcrypt.hashSync(password);
//     db.transaction(trx => {
//       trx.insert({
//         hash: hash,
//         email: email
//       })
//       .into('login')
//       .returning('email')
//       .then(loginEmail => {
//         return trx('users')
//           .returning('*')
//           .insert({
//             email: loginEmail[0],
//             name: name,
//             joined: new Date()
//           })
//           .then(user => {
//             res.json(user[0]);// to get response for request
//           })
//       })
//       .then(trx.commit)
//       .catch(trx.rollback)
//     })
//     .catch(err => res.status(400).json('unable to register'))
// })
// //id of the user; id parameter helps to get any user by grabbing their profile and updating name or email
// app.get('/profile/:id', (req, res) => {A
//   const { id } = req.params; // getting from id 
//   db.select('*').from('users').where({id})
//     .then(user => {
//       if (user.length) {
//         res.json(user[0])
//       } else {
//         res.status(400).json('Not found')
//       }
//     })
//     .catch(err => res.status(400).json('error getting user'))
// })

// //image => update user to increase there entries count when they submit
// app.put('/image', (req, res) => {
//   const { id } = req.body; // getting from body
//   db('users').where('id', '=', id)
//   .increment('entries', 1) // increments the entry of user
//   .returning('entries')
//   .then(entries => {
//     res.json(entries[0]);
//   })
//   .catch(err => res.status(400).json('unable to get entries'))
// })

// app.listen(3000, ()=> {
//   console.log('app is running on port 3000');
// })

// /*
// -----> before starting we must look on what to do <-----
// /-> respone = this is working
// => /signin --> 'post' method since pw and mail --> o/p as success  or fail =( we get a thought since no new user why "post" bcuz of password)
// => /register --> 'post' --> tells new user
// => home screen nust have the ability to access the => /profile/:userId --> 'get' = new user
// => /image --> 'put' since we update =>(count how many photo submitted)= new user
// */

// /*
// what to do before creating a db
// => create database variable and create an object+array to check 
// => without db we have loop users; and we have to loop users to check sign in ; and we lose data when server restarts
// */