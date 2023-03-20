import express from 'express';
import multer from 'multer';
import { signup , getFiles , registration, login } from '../controllers/user.js';

const router = express.Router();

router
  .route('/upload')
  .post(
    multer({ dest: 'temp/'}).single(
      'file'
    ),
    signup
  );

router.get('/allfiles', getFiles)

router.post('/signup',registration)
router.post('/login',login)


export default router;
