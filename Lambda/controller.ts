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
    log.info('Call function Send')
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
      await controllerDB.createEmail({
        to: result.to,
        from: result.from,
        sha256: sha256Html,
        subject: result.subject,
        html: result.html,
      })

      const data = await controllerDB.getEmail(
        conditions.equal({
          eq: result.to,
          filter: 'to',
        }),
      )

      const hash256 = createHash('sha256')
        .update(JSON.stringify(data))
        .digest('base64')

      await controllerDB.createSha256({
        to: result.to,
        sha256: hash256,
      })

      return messages.success('Ok')
    } catch (error: any) {
      log.error(error)
      return messages.error(500, error)
    }
  },
  create: async (event: APIGatewayProxyEvent) => {
    log.info('Call function Create')
    if (!event.body) return messages.errorNotBody()
    const body = JSON.parse(event.body) as ICreate
    const token = createToken(body.email)
    return messages.success({ data: token })
  },
  getTo: async (event: APIGatewayProxyEvent) => {
    log.info('Call function getTo')
    try {
      const params = event.queryStringParameters
      const token = await verifyToken(event.headers['authorization'] as string)
      if (!token) {
        return messages.error(401, 'Token not permited or expirate')
      }
      const email = token.to
      if (params && params.sha256) {
        const dataSha256 = await controllerDB.getSha256(
          conditions.equal({
            eq: email,
            filter: 'to',
          }),
        )
        if (!dataSha256) {
          return messages.error(404, 'Not found')
        }
        const dbSha256 = dataSha256[0].sha256
        if (params.sha256 === dbSha256) {
          return messages.custom(304, 'Same Sha256')
        } else {
          const dataEmail = await controllerDB.getEmail(
            conditions.equal({
              eq: email,
              filter: 'to',
            }),
          )

          if (!dataEmail) {
            return messages.error(404, 'Not found')
          }
          return messages.success({ data: [...dataEmail], sha256: dbSha256 })
        }
      } else {
        const dataEmail = await controllerDB.getEmail(
          conditions.equal({
            eq: email,
            filter: 'to',
          }),
        )

        const dataSha256 = await controllerDB.getSha256(
          conditions.equal({
            eq: email,
            filter: 'to',
          }),
        )
        if (!dataSha256) {
          return messages.error(404, 'Not found Sha256')
        }

        if (!dataEmail) {
          return messages.error(404, 'Not found Emails')
        }

        const sha256 = dataSha256[0].sha256

        return messages.success({ data: [...dataEmail], sha256 })
      }
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
