import { Schema } from 'dynamoose'

const Sha256Schema = new Schema({
  to: {
    type: String,
    required: true,
  },
  sha256: {
    type: String,
    required: true,
  },
  ttl: {
    type: Number,
    required: true,
  },
})

export default Sha256Schema
