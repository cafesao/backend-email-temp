import { model } from 'dynamoose'
import Email from '../schemas/Email'

const DBEmail = model(process.env.TABLE_NAME, Email)

export { DBEmail }
