import { encrypt } from '@/lib/jwt'
import type { NextApiRequest, NextApiResponse } from 'next'


type ResponseData = {
  message: string,
  token: string,
  user: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    const { userName, password } = req.body
    if (userName == "nati" && password == "nati") {
      const token = await encrypt( '1010101010' ,  'admin')
      if (token) {
        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; Secure; SameSite=Strict`)
        res.status(200).json({ message: "Login successful", token: token, user: userName })
      }
    }
  } else {
    res.status(404).end() 
  }
}
