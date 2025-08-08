import { Router } from 'express';
import { verifyJWT } from '../middleware/verifyJWT.js';
import { SaveCurrentNotesController, GetCurrentNotesController } from '../controllers/notes.controllers.js';

const notesRouter = Router();

notesRouter.get('/get-notes/:courseId' , verifyJWT , GetCurrentNotesController);
notesRouter.post('/save-notes' , verifyJWT , SaveCurrentNotesController);

export default notesRouter;