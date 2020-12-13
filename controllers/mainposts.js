const handleMainPosts = (req, res, db) => {
	db('photos')
		.join('users', 'photos.user_id', '=', 'users.id')
		.select('users.username','photos.title', 'photos.caption')
		.orderBy('day', 'desc')
		.then(posts => res.json(posts))
		.catch(err => res.status(400).json('Error: could not get posts'));
}

module.exports = {
	handleMainPosts: handleMainPosts
};