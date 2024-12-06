import express from 'express';
import { pingCheck } from '../../controllers/pingController.js';
import ProjectRouter from './projects.js';

const router = express.Router();
router.use('/ping', pingCheck);
router.use('/projects', ProjectRouter);

export default router;