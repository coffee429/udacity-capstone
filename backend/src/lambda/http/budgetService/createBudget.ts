import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../../utils';
import { createLogger } from '../../../utils/logger'
import { Budget } from '../../../models/Budget'
import { createBudget, getBudget } from '../../../businessLogic/budgetLogic';

const logger = createLogger('createBudget')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId: string = getUserId(event);
    try {
      var budgets : Budget[] = await getBudget(userId);
      if(budgets.length>0) {
        return {
          statusCode: 400,
          body: null
        };
      } else {
        const newBudget: Budget = await createBudget(userId);
        logger.info('Successfully created a new budget');
        return {
          statusCode: 201,
          body: JSON.stringify({ newBudget })
        };
      }
      
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
