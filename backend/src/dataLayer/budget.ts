import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Budget } from '../models/Budget'
import { UpdateBalanceRequest } from '../requests/UpdateBalanceRequest'

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

    async updateBalance(userId: string, req: UpdateBalanceRequest) {
        logger.info(`Method: ${req.method}`);
        var balance = await this.getBalance(userId);
        logger.info(`Current balance: ${balance}`);
        let amountToUpdate = req.amount;
        if(req.method==="ADD") {
            logger.info(`Add amount: ${amountToUpdate}`);
            
            await this.docClient
            .update({
                TableName: this.budgetTable,
                Key: { userId, balance },
                UpdateExpression: 'set balance = :balance, userId =:userId',
                ExpressionAttributeValues: {
                    ':balance': balance + amountToUpdate,
                    ':userId': userId
                },
            })
            .promise()
        }
        else if(req.method==="PAY") {
            logger.info(`Pay amount: ${amountToUpdate}`)
            if( balance >= amountToUpdate) {
                logger.info(`Pay`);
                await this.docClient
                .update({
                    TableName: this.budgetTable,
                    Key: { userId, balance },
                    UpdateExpression: 'set balance = :balance, userId =:userId',
                    ExpressionAttributeValues: {
                        ':balance': balance - amountToUpdate,
                        ':userId': userId
                },
            })
            .promise()
            }
            else logger.info(`Current balance is not enought to pay`);
        }
    }

}