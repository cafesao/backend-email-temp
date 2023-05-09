import SenseLogs from 'senselogs'

import { Condition } from 'dynamoose/dist/Condition'
import { DBEmail } from './model/model'

const log = new SenseLogs()

const controllerDB = {
  get: async (condition: Condition) => {
    try {
      const data = await DBEmail.query(condition)
        .attributes(['to', 'from', 'subject', 'html'])
        .exec()
      if (!data) return false
      log.info(`I take the data from the Table Email`)
      const result = data.map((item: any) => item.toJSON())
      if (Object.keys(result).length === 0) return false
      return result
    } catch (error: any) {
      log.error(error)
      return false
    }
  },
  create: async (data: any) => {
    try {
      const debug = await DBEmail.create(data)
      console.log(debug)
      log.info(`Created in Table Email`)
      return true
    } catch (error: any) {
      log.error(error)
      return false
    }
  },
}

export default controllerDB
