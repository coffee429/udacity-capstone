import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getItemForUser } from '../../businessLogic/itemLogic'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'
import { Item } from '../../models/Item'

const logger = createLogger('getUserId')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId: string = getUserId(event);

    try {
      const item: Item[] = await getItemForUser(userId);
      logger.info('item list retrieved');
      return {
        statusCode: 200,
        body: JSON.stringify({ item })
      };
    } catch (error) {
      logger.error(`Error: ${error.message}`);
      throw error;
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
