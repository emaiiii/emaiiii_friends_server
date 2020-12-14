const handleGetComment = (req, res, db) => {

	db('comments')
		.join('photos', 'comments.photo_id', '=', 'photos.photo_id')
		.join('users', 'comments.user_id', '=', 'users.id')
		.select('photos.photo_id','users.username', 'comments.comment')
		.then(data => res.json(data))
		.catch(err => res.status(400).json('Error: could not get comment'));
}

module.exports = {
	handleGetComment: handleGetComment
};