import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateItemRequest } from '../../requests/CreateItemRequest'
import { getUserId } from '../utils';
import { createItem } from '../../businessLogic/itemLogic'
import { Item } from '../../models/Item'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createItem')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newItemRequest: CreateItemRequest = JSON.parse(event.body);
    const userId: string = getUserId(event);
    try {
      const newItem: Item = await createItem(userId, newItemRequest);
      logger.info('Successfully created a new item.');
      return {
        statusCode: 201,
        body: JSON.stringify({ newItem })
      };
    } catch (error) {
      logger.error(`Error: ${error.message}`);
      throw error;
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
