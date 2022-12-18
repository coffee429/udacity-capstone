import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateItem } from '../../businessLogic/itemLogic'
import { UpdateItemRequest } from '../../requests/UpdateItemRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getUserId')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updateTodoRequest: UpdateItemRequest = JSON.parse(event.body)
    const userId: string = getUserId(event);
    try {
      await updateItem(userId, todoId, updateTodoRequest);
      logger.info(`Successfully updated the todo item: ${todoId}`);
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
