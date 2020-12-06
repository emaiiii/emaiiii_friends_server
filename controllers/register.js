const handleRegister = (req, res, db, bcrypt) => {
	const {fName, lName, email, username, password} = req.body;

	// make sure all input fields are filled out before continuing with request
	// handle only white space inputs
	if(fName.trim().length && lName.trim().length && email.trim().length 
		&& username.trim().length && password.trim().length){
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
						username: username,
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
	}
	else{
		res.status(400).json('Error: fill out all fields');
	}
}

module.exports = {
	handleRegister: handleRegister
};