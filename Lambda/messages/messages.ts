import { APIGatewayProxyResult } from 'aws-lambda'

const messages = {
  success(payload: string | object): APIGatewayProxyResult {
    return {
      statusCode: 200,
      body: JSON.stringify(payload),
    }
  },

  custom(statusCode: number, payload: string | object): APIGatewayProxyResult {
    return {
      statusCode: statusCode,
      body: JSON.stringify(payload),
    }
  },

  errorNotBody(): APIGatewayProxyResult {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Not Body' }),
    }
  },

  error(statusCode: number, payload: string | object): APIGatewayProxyResult {
    return {
      statusCode: statusCode,
      body: JSON.stringify(payload),
    }
  },

  errorDefault(payload: string | object): APIGatewayProxyResult {
    return {
      statusCode: 500,
      body: JSON.stringify(payload),
    }
  },
}

export default messages
