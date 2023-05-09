import { APIGatewayProxyResult } from 'aws-lambda'

const headers = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
}

const messages = {
  success(payload: string | object): APIGatewayProxyResult {
    return {
      statusCode: 200,
      body: JSON.stringify(payload),
      headers,
    }
  },

  errorNotBody(): APIGatewayProxyResult {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Not Body' }),
      headers,
    }
  },

  error(statusCode: number, payload: string | object): APIGatewayProxyResult {
    return {
      statusCode: statusCode,
      body: JSON.stringify(payload),
      headers,
    }
  },

  errorDefault(payload: string | object): APIGatewayProxyResult {
    return {
      statusCode: 500,
      body: JSON.stringify(payload),
      headers,
    }
  },
}

export default messages
