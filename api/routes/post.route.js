import express from 'express'
import { create, getPosts, deletePost, updatePost } from '../controllers/post.controllers.js';
import { verifyToken } from '../Utils/verifyUser.js'

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts', getPosts);
router.delete('/deletepost/:postId/:userId', verifyToken, deletePost);
router.put('/updatepost/:postId/:userId', verifyToken, updatePost);
//router.get('/post/:postSlug', getPost)

export default router;