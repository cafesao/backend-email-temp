import { APIGatewayProxyHandlerV2, APIGatewayProxyResult } from 'aws-lambda'
import routes from './routes'

export const handler: APIGatewayProxyHandlerV2 = async (
  event,
  _,
  callback,
): Promise<any> => {
  const controller = routes(
    event.requestContext.http.path,
    event.requestContext.http.method,
  )
  const response: APIGatewayProxyResult = await controller(event)
  callback(null, response)
}
