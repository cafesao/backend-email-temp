import { Schema } from 'dynamoose'

const EmailSchema = new Schema({
  to: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  sha256: {
    type: String,
    required: true,
    rangeKey: true,
  },
  subject: {
    type: String,
    required: false,
  },
  html: {
    type: String,
    required: false,
  },
  ttl: {
    type: Number,
    required: true,
  },
})

export default EmailSchema
