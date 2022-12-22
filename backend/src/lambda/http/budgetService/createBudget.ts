import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../../utils';
import { createLogger } from '../../../utils/logger'
import { Budget } from '../../../models/Budget'
import { createBudget } from '../../../businessLogic/budgetLogic';

const logger = createLogger('createItem')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId: string = getUserId(event);
    try {
      const newBudget: Budget = await createBudget(userId);
      logger.info('Successfully created a new item.');
      return {
        statusCode: 201,
        body: JSON.stringify({ newBudget })
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
