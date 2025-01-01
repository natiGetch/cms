import { encrypt } from '@/lib/jwt'
import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string,
  token : string,
  user : string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    if (req.method === 'POST') {
       const {userName , password} = req.body
      if(userName == "nati" && password == "nati") {
         const token = await encrypt(userName)
         if(token) {
            res.status(200).json({message : "Log in succfull", token : token , user : userName})
         }
      }
      } else {
        res.status(404)
      }
    
}