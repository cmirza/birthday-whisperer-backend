import { Response, NextFunction } from 'express';
import { User, IUser, Contact, IContact } from '../models/User';
import CustomError from '../utils/customError';
import { IAuthRequest } from '../middleware/authMiddleware';

export const addContact = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id;
        const { name, birthdate } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newContact = new Contact({ name, birthdate });
        user.contacts.push(newContact);
        await user.save();

        res.status(201).json({ message: 'Contact added' });
    } catch (error) {
        next(error);
    }
};


export const getContacts = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id;

        const user: IUser | null = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ contacts: user.contacts });
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id;
        const contactId = req.params.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { contacts: { _id: contactId } } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id;
        const contactId = req.params.id;
        const { name, birthdate } = req.body;

        const updateData: any = {};

        if (name) {
            updateData["contacts.$.name"] = name;
        }

        if (birthdate) {
            updateData["contacts.$.birthdate"] = birthdate;
        }

        const user: IUser | null = await User.findOneAndUpdate(
            { _id: userId, "contacts._id": contactId },
            { $set: updateData },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User or contact not found' });
        }

        res.status(200).json({ message: 'Contact updated successfully' });
    } catch (error) {
        next(error);
    }
};
