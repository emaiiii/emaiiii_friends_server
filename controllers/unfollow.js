const handleUnfollow = (req, res, db) => {
	const {unfollowed_id, unfollower_id} = req.params;

	db('follows').where('id', unfollower_id).where('following_id', unfollowed_id)
		.del()
		.then(() => {
			db('users').where('id', '=', unfollower_id)
				.decrement('num_following', 1)
				.then(() => {
					db('users').where('id', '=', unfollowed_id)
						.decrement('num_followers', 1)
						.then(() => {
							res.json('Success: completed table updates');
						})
						.catch(err => res.status(400).json('Error: could not handle requests'));
				})
				.catch(err => res.status(400).json('Error: could not handle requests'));
		})
		.catch(err => res.status(400).json('Error: could not handle requests'));
}

module.exports = {
	handleUnfollow: handleUnfollow
}