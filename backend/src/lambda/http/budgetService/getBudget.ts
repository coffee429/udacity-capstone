import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getBudget } from '../../../businessLogic/budgetLogic'
import { getUserId } from '../../utils';
import { createLogger } from '../../../utils/logger'
import { Budget } from '../../../models/Budget'

const logger = createLogger('getUserId')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId: string = getUserId(event);

    try {
      const budget: Budget[] = await getBudget(userId);
      logger.info(`Return budget: ${budget[0].balance}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ budget })
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
