const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const follow = require('./controllers/follow');
const unfollow = require('./controllers/unfollow');


// link to database
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'postgres',
    database : 'friends'
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

/*follow post request*/
app.post('/follow/:followed_id/:follower_id', (req, res) => {follow.handleFollow(req, res, db)})

/*following post request*/
app.post('/unfollow/:unfollowed_id/:unfollower_id', (req, res) => {unfollow.handleUnfollow(req, res, db)})

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