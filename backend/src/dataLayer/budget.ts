import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Budget } from '../models/Budget'
import { UpdateBudgetRequest } from '../requests/UpdateBudgetRequest'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('Budget')

export class BudgetAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly budgetTable = process.env.BUDGET_TABLE
    ) { }

    async getBudget(userId: string) {
        logger.info(`Getting user's budget`);
        const result = await this.docClient
            .query({
                TableName: this.budgetTable,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise();
        console.log(result.Items)
        return result.Items as Budget[]
    }

    async updateBudget(userId: string, req: UpdateBudgetRequest) {
        var status : boolean = false
        logger.info(`Method: ${req.method}`);
        var balances = await this.getBudget(userId)
        var balance = balances[0].balance  
        logger.info(`Current balance: ${balance}`);  
        let amountToUpdate = req.amount;
        if(req.method==="ADD") {
            logger.info(`Add amount: ${amountToUpdate}`);
            
            await this.docClient
            .update({
                TableName: this.budgetTable,
                Key: { userId },
                UpdateExpression: 'set balance = :balance',
                ExpressionAttributeValues: {
                    ':balance': balance + amountToUpdate,
                },
            })
            .promise()
            status = true
        }
        else if(req.method==="PAY") {
            logger.info(`Pay amount: ${amountToUpdate}`)
            if( balance >= amountToUpdate) {
                logger.info(`Pay`);
                await this.docClient
                .update({
                    TableName: this.budgetTable,
                    Key: { userId },
                    UpdateExpression: 'set balance = :balance',
                    ExpressionAttributeValues: {
                        ':balance': balance - amountToUpdate,
                },
            })
            .promise()
            status = true
            }else {
                logger.info(`Current balance is not enought to pay`);
                status = false
            }
        }
        return status
    }

    async createBudget(newBudget: Budget): Promise<Budget> {
        logger.info(`Create new budget for user ${newBudget.userId}`);
        await this.docClient
            .put({
                TableName: this.budgetTable,
                Item: newBudget
            })
            .promise();
        return newBudget;
    }

}