import { check } from 'express-validator';

export const validateLogin = [check('email').isEmail(), check('password').isLength({ min: 3 })];
