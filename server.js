const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

/*harcoded database for testing purposes*/
const database = {
	users: [
		{
			id: '1',
			fName: 'Erik',
			lName: 'Mai',
			email: 'airwickmai@gmail.com',
			password: 'cookies',
			joined: new Date(),
		},
		{
			id: '2',
			fName: 'Mitchell',
			lName: 'Doan',
			email: 'mdoan@gmail.com',
			password: 'cakes',
			joined: new Date(),
		}
	]
}

app.get('/', (req, res) => {
	res.send(database.users);
})

/*sign in post request*/
app.post('/signin', (req, res) => {
	if(req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password){
		res.json('Success');
	}
	else{
		res.status(400).json('Error: unsuccessful sign in');
	}
})

/*register post request*/
app.post('/register', (req, res) => {
	const {fName, lName, email, password} = req.body;

	database.users.push({
		id: '3',
		fName: fName,
		lName: lName,
		email: email,
		password: password,
		joined: new Date()
	})

	res.json(database.users[database.users.length-1]);
})

/*profile get request*/
app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	let found = false;

	database.users.forEach(user => {
		if(user.id === id) {
			found = true;
			return res.json(user);
		}
	});

	if (!found){
		res.status.json("Error: user not found");
	}
})

app.listen(3000, () => {
	console.log("app is running on port 3000");
})


/*
/sign in --> POST
/register --> POST
/profile/:userid --> GET
*/