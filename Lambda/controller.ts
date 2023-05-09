import { APIGatewayProxyEvent } from 'aws-lambda'
import { createHash } from 'crypto'
import senseLogs from 'senselogs'
import parser from 'lambda-multipart-parser'

import messages from './messages/messages'
import verifyIp from './helper/verifyIp'
import controllerDB from './aws/db/DB'
import conditions from './aws/db/conditions/conditions'
import { createToken, verifyToken } from './helper/jwt'

import { ICreate } from './interface/controllers'

const log = new senseLogs()

const controller = {
  send: async (event: APIGatewayProxyEvent) => {
    const ip = event.headers['x-forwarded-for'] as string
    if (!verifyIp(ip)) {
      log.error('IP Andress not permited: ' + ip)
      return messages.error(401, 'IP Andress not permited')
    }
    if (!event.body) {
      log.error('Not Body')
      return messages.errorDefault('Not Body')
    }
    const result = await parser.parse(event)
    const sha256Html = createHash('sha256').update(result.html).digest('base64')

    log.info('---------------------')
    log.info('Remetente: ' + result.to)
    log.info('Destinatario: ' + result.from)
    log.info('Assunto: ' + result.subject)
    log.info('HTML: ' + result.html)
    log.info('IP Sendgrid: ' + event.headers['x-forwarded-for'])
    log.info('SHA-256: ' + sha256Html)
    log.info('---------------------')
    try {
      await controllerDB.create({
        to: result.to,
        from: result.from,
        sha256: sha256Html,
        subject: result.subject,
        html: result.html,
      })

      return messages.success('Ok')
    } catch (error: any) {
      log.error(error)
      return messages.error(500, error)
    }
  },
  create: async (event: APIGatewayProxyEvent) => {
    if (!event.body) return messages.errorNotBody()
    const body = JSON.parse(event.body) as ICreate
    const token = createToken(body.email)
    return messages.success({ data: token })
  },
  getTo: async (event: APIGatewayProxyEvent) => {
    try {
      const token = await verifyToken(event.headers['authorization'] as string)
      if (!token) {
        return messages.error(401, 'Token not permited or expirate')
      }
      const email = token.to
      const data = await controllerDB.get(
        conditions.equal({
          eq: email,
          filter: 'to',
        }),
      )
      if (!data) {
        return messages.error(400, 'Not found')
      }
      return messages.success(data)
    } catch (error: any) {
      log.error(error)
      if (error.message === 'invalid signature') {
        return messages.error(401, 'Token not permited or expirate')
      }
      return messages.error(500, error)
    }
  },
}

export default controller
