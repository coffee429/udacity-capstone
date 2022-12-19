import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getBalance } from '../../../businessLogic/budgetLogic'
import { getUserId } from '../../utils';
import { createLogger } from '../../../utils/logger'

const logger = createLogger('getUserId')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId: string = getUserId(event);

    try {
      const balance: number = await getBalance(userId);
      logger.info(`Balance: ${balance}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ balance })
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
