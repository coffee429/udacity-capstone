import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteItem } from '../../../businessLogic/itemLogic'
import { getUserId } from '../../utils'
import { createLogger } from '../../../utils/logger'
const logger = createLogger('deleteItem')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const itemId = event.pathParameters.itemId
    const userId: string = getUserId(event);
    try {
      await deleteItem(userId, itemId);
      logger.info(`Deleted item id: ${itemId}`);
      return {
        statusCode: 204,
        body: undefined
      };
    } catch (error) {
      logger.error(`Error: ${error.message}`);
      throw error;
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
