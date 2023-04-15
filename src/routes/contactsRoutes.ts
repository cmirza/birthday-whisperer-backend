import { Router } from 'express';
import { addContact, getContacts, deleteContact, updateContact } from '../controllers/contactsController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateObjectId } from '../middleware/validateObjectId';
import { validateContact } from '../middleware/validateContact';

const router = Router();

router.post('/', authMiddleware, validateContact, addContact);
router.get('/', authMiddleware, getContacts);
router.delete('/:id', authMiddleware, validateObjectId, deleteContact);
router.put('/:id', authMiddleware, validateObjectId, validateContact, updateContact)

export default router;
