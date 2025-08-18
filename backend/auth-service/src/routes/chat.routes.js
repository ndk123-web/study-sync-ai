import { Router } from 'express'
import { verifyJWT } from '../middleware/verifyJWT.js';
import { sendChatController } from '../controllers/chat.controller.js';

const chatRouter = Router();

chatRouter.post('/send-chat', verifyJWT , sendChatController);

export default chatRouter;