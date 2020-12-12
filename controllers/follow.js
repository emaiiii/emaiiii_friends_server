const handleFollow = (req, res, db) => {
	const {followed_id, follower_id} = req.params;

	// insert into the follows table first
	// if successful then continue to update the number of followers and following from users table
	// if unsuccessful then catch and send error message
	db('follows').insert([{id: follower_id, following_id: followed_id}])
		.then(() => {
			// increment the number of followers
			db('users').where('id', '=', followed_id)
				.increment('num_followers', 1)
				.then(() => {
					// increment the number of following
					db('users').where('id', '=', follower_id)
						.increment('num_following', 1)
						.then(() => {
							res.json('Success: completed table updates');
						})
						.catch(err => res.status(400).json('Error: could not handle request'));
				})
				.catch(err => res.status(400).json('Error: could not handle request'));
		})
		.catch(err => res.status(400).json('Error: could not handle request'));
}

module.exports = {
	handleFollow: handleFollow
}