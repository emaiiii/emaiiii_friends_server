const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const post = require('./controllers/post');
const searchPost = require('./controllers/searchPost');
const searchUser = require('./controllers/searchUser');
const updateStat = require('./controllers/updateStat');


// link to database
// const db = knex({
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     user : 'postgres',
//     password : 'postgres',
//     database : 'friends'
//   }
// });
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'mitchdoan',
    password : 'postgres',
    database : 'Friends'
  }
});

db.select('*').from('users').then(data => {
	console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

/*sign in post request*/
app.post('/signin', (req, res) => {signin.handleSignIn(req, res, db, bcrypt)})

/*register post request*/
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

/*post post request*/
app.post('/post', (req, res) => {post.handlePost(req, res, db)})

/*searchPost post request*/
app.post('/searchPost', (req, res) => {searchPost.handleSearchPost(req, res, db)})

/*searchUser post request*/
app.post('/searchUser', (req, res) => {searchUser.handleSearchUser(req, res, db)})

/*updateStat post request*/
app.post('/updateStat', (req, res) => {updateStat.handleUpdateStat(req, res, db)})

/*profile get request*/
/*code can be adjusted to implement any functionality
that requires you to get users*/
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.listen(3000, () => {
	console.log("app is running on port 3000");
})


/*
/sign in --> POST
/register --> POST
/profile/:userid --> GET
*/