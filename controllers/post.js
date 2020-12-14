const handlePost = (req, res, db) => {
	const {user_id, title, caption, tags} = req.body;
	//const {name, data} = req.files.image;
	//res.json(name);
	//res.json(data);

	// make sure all input fields are filled out before continuing with request
	// handle only white space inputs

	// update the photos table
	db('photos')
		.returning('photo_id')
		.insert({
			user_id: user_id,
			//imgname: name,
			//img: data[0],
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
}

module.exports = {
	handlePost: handlePost
};