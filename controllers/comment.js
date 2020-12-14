const handleComment = (req, res, db) => {
	const {photo_id, user_id, comment} = req.body;

	db('comments')
		.insert({
			photo_id: photo_id,
			user_id: user_id,
			comment: comment
		})
		.then(() => res.json('Success: added comment'))
		.catch(err => res.status(400).json('Error: could not add comment'));
}

module.exports = {
	handleComment: handleComment
};