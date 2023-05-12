import { model } from 'dynamoose'

import Email from '../schemas/Email'
import Sha256 from '../schemas/Sha256'

const DBEmail = model(process.env.TABLE_NAME, Email)
const DBSha256 = model(process.env.TABLE_NAME_SHA256, Sha256)

export { DBEmail, DBSha256 }
