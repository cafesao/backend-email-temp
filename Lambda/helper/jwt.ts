import { sign, verify, JwtPayload } from 'jsonwebtoken'

function createToken(to: string) {
  return sign(
    {
      to,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    },
  )
}

async function verifyToken(token: string): Promise<JwtPayload | false> {
  if (!token) return false
  return new Promise((resolve, reject) =>
    verify(
      token.split(' ')[1],
      process.env.JWT_SECRET,
      (err: any, decoded: any) => (err ? reject(err) : resolve(decoded)),
    ),
  )
}

export { createToken, verifyToken }
