import * as jose from 'jose';

import { JWT_SECRET } from '$env/static/private';
import type { ClaimType } from '$lib/types/auth';

const secret = jose.base64url.decode(JWT_SECRET)

export async function make_auth_token(claims: ClaimType): Promise<string> {
  const jwt = await new jose.EncryptJWT(claims)
    .setProtectedHeader({ alg: 'dir', enc: 'A192GCM' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .encrypt(secret)
  return jwt
}

export async function decode_auth_token(token: string): Promise<ClaimType> {
  const { payload } = await jose.jwtDecrypt(token, secret)
  return payload as ClaimType
}