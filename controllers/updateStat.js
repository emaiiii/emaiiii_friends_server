const handleUpdateStat = (req, res, db) => {
	const {updateType, photoID, com, commenterID} = req.body;

	switch(updateType) {

		// Searches for posts and orders by likes
		case 'like' :
			return db('photo_stats')
				.increment('num_likes')
				.where('photo_id', '=', photoID)
				.then(results => {
					res.json(results);
				})
				.catch(err => res.status(400).json("Error: unable to update like"))
		break;

		// Searches for posts and orders by dislikes
		case 'dislike' :
			return db('photo_stats')
				.increment('num_dislikes')
				.where('photo_id', '=', photoID)
				.then(results => {
					res.json(results);
				})
				.catch(err => res.status(400).json("Error: unable to update dislike"))
		break;

		// Searches for posts based on date 
		case 'comment' :
			return db('photo_stats')
				.increment('num_dislikes')
				.where('photo_id', '=', photoID)
				.then(pid => {
					db('comments')
					.returning('*')
					.insert({
						photo_id: photoID,
						user_id: commenterID,
						comment: com
					})
					.then(results =>{
						res.json(results);
					})
				})
				.catch(err => res.status(400).json("Error: unable to update comment"))

		// Searches for posts based on username
		case 'view' :
			return db('photo_stats')
				.increment('num_views')
				.where('photo_id', '=', photoID)
				.then(results => {
					res.json(results);
				})
				.catch(err => res.status(400).json("Error: unable to update view"))
		break;
		default :
			res.status(400).json('Error: Incorrect update parameter');
	}         
}

module.exports = {
	handleUpdateStat: handleUpdateStat
};