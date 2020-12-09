const handleSearchUser = (req, res, db) => {
	const {searchType, searchParameter} = req.body;

	switch(searchType) {

		//Searches for users by title of photos;
		case 'title' :
			return db.select('*').from('users AS u')
				.leftJoin('photos AS p', 'p.user_id', 'u.id')
        		.where('p.title', '=', searchParameter)
				.then(results => {
					res.json(results);
				})
				.catch(err => res.status(400).json("Error: unable to get user"))
		break;

		// Searches for users by tags
		case 'tags' :
			return db.select('*').from('users AS u')
				.leftJoin('photos AS p', 'p.user_id', 'u.id')
        		.leftJoin('photo_tag as pt', 'pt.photo_id', 'p.photo_id')
        		.where('pt.tag', '=', searchParameter)
				.then(results => {
					res.json(results);
				})
				.catch(err => res.status(400).json("Error: unable to get user"))
		break;

		// Searches for users and orders by likes
		case 'likes' :
			return db.select('*').from('users AS u')
				.leftJoin('photos AS p', 'p.user_id', 'u.id')
        		.leftJoin('photo_stats AS ps', 'ps.photo_id', 'p.photo_id')
				.orderBy('ps.num_likes', 'desc')
				.limit(10)
				.then(results => {
					res.json(results);
				})
				.catch(err => res.status(400).json("Error: unable to get post"))
		break;

		// Searches for users and orders by dislikes
		case 'dislikes' :
			return db.select('*').from('users AS u')
				.leftJoin('photos AS p', 'p.user_id', 'u.id')
        		.leftJoin('photo_stats AS ps', 'ps.photo_id', 'p.photo_id')
				.orderBy('ps.num_dislikes', 'desc')
				.limit(10)
				.then(results => {
					res.json(results);
				})
				.catch(err => res.status(400).json("Error: unable to get post"))
		break;

		// Searches for users by joined date 
		case 'date' :
			return db.select('*').from('users')
				.orderBy('joined')
				.limit(10)
				.then(results => {
					res.json(results);
				})
				.catch(err => res.status(400).json("Error: unable to get post"))

		// Searches for posts based on username
		case 'user' :
			return db.select('*').from('users')
				.where('username', '=', searchParameter)
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
	handleSearchUser: handleSearchUser
};