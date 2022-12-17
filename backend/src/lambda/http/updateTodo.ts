import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updateTodoRequest: UpdateTodoRequest = JSON.parse(event.body)
    const userId: string = getUserId(event);
    try {
      await updateTodo(userId, todoId, updateTodoRequest);
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
