import express from 'express'
import { test, updateUser, deleteUser, signout, getUsers, getUser, getLimitedUser} from '../controllers/user.controllers.js';
import { verifyToken } from '../Utils/verifyUser.js'

const router = express.Router();

router.get('/test', test)
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers)
router.get('/:userId', getUser);
router.get('/getlimiteduser/:userId', getLimitedUser);

export default router;