const handlePost = (req, res, db) => {
	const {uid, ttl, cap, tags} = req.body;

	var ind_tag = tags.split(" ");
	var pid;
	var len = ind_tag.length;

	// make sure all input fields are filled out before continuing with request
	// handle only white space inputs
	if(ttl.trim().length && cap.trim().length){

		// use transcation if you want to make multiple operations on databases
		// if one fails then they all fail
		db.transaction(trx => {
			trx.insert({
				user_id: uid,
				title: ttl,
				caption: cap,
				//img: pg_read_file('/home/xyz')::bytea
				day: new Date()
			})
			.into('photos')
			.returning('photo_id')
			.then(photoID => {
				ind_tag.forEach(element =>
					trx('photo_tag')
						.insert({
							photo_id: photoID[0]	
						})	
					)
				return trx('photo_stats')
					.returning('*')
					.insert({
						photo_id: photoID[0]
				})
				.then(results => {
					res.json(results[0]);
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
	// for(var i = 0; i < len; i++){
	// 	addTags(req, res, db, pid, ind_tag[i]);
	// }
}

// function addTags(req, res, db, pid, t){
// 	db.transaction(trx => {
// 		trx.insert({
// 			photo_id: pid,
// 			tag: t
// 		})
// 		.into('photo_tag')
// 		returning('*')
// 		.then(results => {
// 			res.json(results[0]);
// 		})
// 	})
// }

module.exports = {
	handlePost: handlePost
};