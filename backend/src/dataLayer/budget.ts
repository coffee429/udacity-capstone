import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Budget } from '../models/Budget'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('Balance')

export class BudgetAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly budgetTable = process.env.BUDGET_TABLE
    ) { }

    async getBalance(userId: string) {
        logger.info(`Getting user's balance`);
        const result = await this.docClient
            .query({
                TableName: this.budgetTable,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise();
        return (result.Items as Budget[])[0].balance
    }

    async updateBalance(userId: string, amount: number) {
        logger.info(`Add balance into userId: ${userId}`);
        let balance = this.getBalance(userId)
        await this.docClient
            .update({
                TableName: this.budgetTable,
                Key: { userId, balance },
                UpdateExpression: 'set balance = :balance',
                ExpressionAttributeValues: {
                    ':balance': await balance + amount
                },
            })
            .promise()
    }

}