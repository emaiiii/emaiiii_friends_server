const handleSearchPost = (req, res, db) => {
	const {searchType, searchParameter} = req.body;

	switch(searchType) {

		// Searches for posts by tags
		case 'tags' :
			return db.select('*').from('photo_tag')
				.where('tag', '=', searchParameter)
				.then(results => {
					res.json(results);
				})
				.catch(err => res.status(400).json("Error: unable to get post"))
		break;

		// Searches for posts and orders by likes
		case 'likes' :
			return db.select('*').from('photo_stats')
				.orderBy('num_likes', 'desc')
				.limit(10)
				.then(results => {
					res.json(results);
				})
				.catch(err => res.status(400).json("Error: unable to get post"))
		break;

		// Searches for posts and orders by dislikes
		case 'dislikes' :
			return db.select('*').from('photo_stats')
				.orderBy('num_dislikes', 'desc')
				.limit(10)
				.then(results => {
					res.json(results);
				})
				.catch(err => res.status(400).json("Error: unable to get post"))
		break;

		// Searches for posts based on date 
		case 'date' :
			var start = searchParameter.concat("T00:00:00.000Z");
			var end = searchParameter.concat("T23:59:59.999Z");
			return db.select('*').from('photos')
				.where('day', '>=', start)
				.where('day', '<', end)
				.limit(10)
				.then(results => {
					res.json(results);
				})
				.catch(err => res.status(400).json("Error: unable to get post"))

		// Searches for posts based on username
		case 'user' :
			return db.select('*').from('photos')
				.join('users', function() {
					this.on('users.id', '=', 'photos.user_id')
					this.andOnVal('users.username', '=', searchParameter)
				})
				.then(results => {
					res.json(results);
				})
				.catch(err => res.status(400).json("Error: unable to get post"))
		break;
		default :
			res.status(400).json('Error: Incorrect search parameter');
	}         
}

module.exports = {
	handleSearchPost: handleSearchPost
};