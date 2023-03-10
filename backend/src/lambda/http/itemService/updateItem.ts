import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateItem } from '../../../businessLogic/itemLogic'
import { UpdateItemRequest } from '../../../requests/UpdateItemRequest'
import { getUserId } from '../../utils'
import { createLogger } from '../../../utils/logger'

const logger = createLogger('getUserId')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const itemId = event.pathParameters.itemId
    const updateItemRequest: UpdateItemRequest = JSON.parse(event.body)
    const userId: string = getUserId(event);
    try {
      await updateItem(userId, itemId, updateItemRequest);
      logger.info(`Successfully updated the item: ${itemId}`);
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
