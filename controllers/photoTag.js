const handlePhotoTag = (req, res, db) => {
	const {tags} = req.body;

	// make sure all input fields are filled out before continuing with request
	// handle only white space inputs
	var ind_tag = tags.split(" ");

		// use transcation if you want to make multiple operations on databases
		// if one fails then they all fail
	for(let i = 0; i < ind_tag.length; i++){
		let ptag = ind_tag[i];

		db.transaction(trx => {
			trx.insert({
				photo_id: 1,
				tag: ptag
			})
			.into('photo_tag')
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('Error: unable to add tag to photo'));
	}
}

module.exports = {
	handlePhotoTag: handlePhotoTag
};