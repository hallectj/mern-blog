import express from 'express';
import { verifyToken } from '../Utils/verifyUser.js'
import { createComment } from '../controllers/comment.controller.js';
import { getPostComments } from '../controllers/comment.controller.js';
import { likeComment, editComment, deleteComment, getcomments } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/getpostcomments/:postId', getPostComments);
router.put('/likecomment/:commentId', verifyToken, likeComment);
router.put('/editcomment/:commentId', verifyToken, editComment);
router.get('/getcomments', verifyToken, getcomments);
router.delete('/deletecomment/:commentId', verifyToken, deleteComment);

export default router;