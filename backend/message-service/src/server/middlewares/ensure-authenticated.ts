import 'dotenv/config';
import { verify } from 'jsonwebtoken';
import { ApiRequest, ApiReply } from '../@types';

interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET;

export async function ensureAuthenticated(
  request: ApiRequest,
  reply: ApiReply,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ message: 'Token não informado' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return reply.status(401).send({ message: 'Token inválido' });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as TokenPayload;

    (request as any).userEmail = decoded.sub;

    return;
  } catch {
    return reply.status(401).send({ message: 'Token inválido ou expirado' });
  }
}
