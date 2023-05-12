import SenseLogs from 'senselogs'

import { Condition } from 'dynamoose/dist/Condition'
import { DBEmail, DBSha256 } from './model/model'

const log = new SenseLogs()

const controllerDB = {
  getEmail: async (condition: Condition) => {
    try {
      const data = await DBEmail.query(condition)
        .attributes(['to', 'from', 'subject', 'html', 'ttl'])
        .exec()
      if (!data) return false
      log.info(`I take the data from the Table Email`)
      const result = data
        .map((item: any) => item.toJSON())
        .sort((a, b) => a.ttl - b.ttl)
        .reverse()
      if (Object.keys(result).length === 0) return false
      return result
    } catch (error: any) {
      log.error(error)
      return false
    }
  },
  createEmail: async (data: any) => {
    try {
      await DBEmail.create({
        ...data,
        ttl: Math.floor(Date.now() / 1000),
      })
      log.info(`Created in Table Email`)
      return true
    } catch (error: any) {
      log.error(error)
      return false
    }
  },
  getSha256: async (condition: Condition) => {
    try {
      const data = await DBSha256.query(condition).exec()
      if (!data) return false
      log.info(`I take the data from the Table Sha256`)
      const result = data.map((item: any) => item.toJSON())
      if (Object.keys(result).length === 0) return false
      return result
    } catch (error: any) {
      log.error(error)
      return false
    }
  },
  createSha256: async (data: any) => {
    try {
      await DBSha256.update({
        ...data,
        ttl: Math.floor(Date.now() / 1000),
      })
      log.info(`Created in Table Sha256`)
      return true
    } catch (error: any) {
      log.error(error)
      return false
    }
  },
}

export default controllerDB
