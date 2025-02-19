// import { Session } from '@prisma/client';
import { Request } from 'express';

export interface UserRequest {
  id: string;
  username: string;
  email: string;
}

export interface AuthRequest extends Request {
  user: UserRequest;
  // session: Session;
}


