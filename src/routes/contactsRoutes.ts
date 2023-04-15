import { Router } from 'express';
import { addContact, getContacts, deleteContact, updateContact } from '../controllers/contactsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, addContact);
router.get('/', authMiddleware, getContacts);
router.delete('/:id', authMiddleware, deleteContact);
router.put('/:id', authMiddleware, updateContact)

export default router;
