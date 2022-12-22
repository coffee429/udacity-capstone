import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateBalance } from '../../../businessLogic/budgetLogic'
import { UpdateBalanceRequest } from '../../../requests/UpdateBalanceRequest'
import { getUserId } from '../../utils'
import { createLogger } from '../../../utils/logger'

const logger = createLogger('getUserId')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const updateBalanceRequest: UpdateBalanceRequest = JSON.parse(event.body)
    const userId: string = getUserId(event);
    try {
      await updateBalance(userId, updateBalanceRequest);
      logger.info("Debug here")
      return {
        statusCode: 204,
        body: undefined
      };
    } catch (error) {
      logger.error(`Error: ${error.message}`);
      throw error;
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
