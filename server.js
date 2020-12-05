const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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
app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);

			if(isValid){
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0]);
					})
					.catch(err => res.status(400).json("Error: unable to get user"))
			}
			else{
				res.status(400).json("Error: wrong credentials");
			}
		})
		.catch(err => res.status(400).json("Error: wrong credentials"))
})

/*register post request*/
app.post('/register', (req, res) => {
	const {fName, lName, email, password} = req.body;

	var hash = bcrypt.hashSync(password);

	// use transcation if you want to make multiple operations on databases
	// if one fails then they all fail
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					fname: fName,
					lname: lName,
					email: loginEmail[0],
					joined: new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => res.status(400).json('Error: unable to register'));
})

/*profile get request*/
/*code can be adjusted to implement any functionality
that requires you to get users*/
app.get('/profile/:id', (req, res) => {
	const {id} = req.params;

	db.select('*').from('users').where({id})
		.then(user => {
			if(user.length){
				res.json(user[0]);
			}
			else{ 
				res.status(400).json("Error: user not found");
			}

		})
		.catch(err => res.status(400).json("Error: user not found"))
})

app.listen(3000, () => {
	console.log("app is running on port 3000");
})


/*
/sign in --> POST
/register --> POST
/profile/:userid --> GET
*/