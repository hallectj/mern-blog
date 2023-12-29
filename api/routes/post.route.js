import express from 'express'
import { create, getPosts } from '../controllers/post.controllers.js';
import { verifyToken } from '../Utils/verifyUser.js'

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts', getPosts);

export default router;