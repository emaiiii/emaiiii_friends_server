const handlePost = (req, res, db) => {
	const {uid, ttl, cap, tags} = req.body;
	var pid;
	// make sure all input fields are filled out before continuing with request
	// handle only white space inputs
	if(ttl.trim().length && cap.trim().length){

		//use transcation if you want to make multiple operations on databases
		//if one fails then they all fail
		db.transaction(trx => {
			trx.insert({
				user_id: uid,
				title: ttl,
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
	}
}

module.exports = {
	handlePost: handlePost
};