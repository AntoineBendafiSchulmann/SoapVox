import { Request, Response } from 'express';

const register = (req: Request, res: Response) => {
  res.send('Register successful');
};

export default register;
