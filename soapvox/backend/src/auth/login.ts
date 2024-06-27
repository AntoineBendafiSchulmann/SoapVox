import { Request, Response } from 'express';

const login = (req: Request, res: Response) => {
  res.send('Login successful');
};

export default login;
