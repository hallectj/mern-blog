import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
    try {
        const { postId, userId, content } = req.body;
        if(userId !== req.user.id){
            return next(errorHandler(403, "You are not allowed to create comment for this post"));
        }

        const newComment = Comment({
            postId,
            userId,
            content
        });

        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    } catch (error) {
        next(error);
    }
}