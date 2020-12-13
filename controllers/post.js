const handlePost = (req, res, db) => {
	const {user_id, title, caption, tags} = req.body;
	// make sure all input fields are filled out before continuing with request
	// handle only white space inputs

		// update the photos table
		db('photos')
			.returning('photo_id')
			.insert({
				user_id: user_id,
				title: title,
				caption: caption,
				day: new Date()
			})
			.then(photo_id => {
				//res.json(photo_id[0]);
				db('photo_stats')
					.returning('photo_id')
					.insert({
						photo_id: photo_id[0]
					})
					.then(photo_id => {
						var ind_tag = tags.split(" ");
						var len = ind_tag.length;

						ind_tag.map(tag => {
							db('photo_tags')
							.insert({
								photo_id: photo_id[0],
								tag: tag
							})
							.then(() => {
								res.json("Success: updated all tables for post");
							})
							.catch(err => res.status(400).json('Error: could not handle post request'));
						})


					})
					.catch(err => res.status(400).json('Error: could not handle post request'));
			})
			.catch(err => res.status(400).json('Error: could not handle post request'));



		//use transcation if you want to make multiple operations on databases
		//if one fails then they all fail
		/*db.transaction(trx => {
			trx.insert({
				user_id: user_id,
				title: title,
				caption: cap,
				day: new Date()
			})
			.into('photos')
			.returning('photo_id')
			.then(photoID => {
				return trx('photo_stats')
					.returning('photo_id')
					.insert({
						photo_id: photoID[0]
					})
					.then(function(photoStats) {
						var ind_tag = tags.split(" ");
						var len = ind_tag.length;
						for(let i = 0; i < len; i++){
							let ptag = ind_tag[i];
							console.log(ptag);
							trx('photo_tag')
							.insert({
								photo_id: photoStats[0],
								tag: ptag
							})
						}
						res.json(photoStats[0]);
					})
				})	
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('Error: unable to post'));
	}

	else{
		res.status(400).json('Error: fill out all fields');
	}*/
}

module.exports = {
	handlePost: handlePost
};