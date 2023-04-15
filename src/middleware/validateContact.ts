import { Request, Response, NextFunction } from 'express';
import { contactSchema } from '../validators/contactValidator';

export const validateContact = (req: Request, res: Response, next: NextFunction) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    next();
};
