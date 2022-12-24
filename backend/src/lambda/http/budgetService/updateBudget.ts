import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateBudget } from '../../../businessLogic/budgetLogic'
import { UpdateBudgetRequest } from '../../../requests/UpdateBudgetRequest'
import { getUserId } from '../../utils'
import { createLogger } from '../../../utils/logger'

const logger = createLogger('getUserId')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const updateBudgetRequest: UpdateBudgetRequest = JSON.parse(event.body)
    const userId: string = getUserId(event);
    try {
      var status = await updateBudget(userId, updateBudgetRequest);
      logger.info("Debug here")
      return {
        statusCode: 200,
        body: JSON.stringify({status})
      };
    } catch (error) {
      logger.error(`Error: ${error.message}`);
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
