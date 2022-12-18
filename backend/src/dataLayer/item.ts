import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Item } from '../models/Item'
import { ItemUpdate } from '../models/ItemUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('Item')

export class ItemAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly itemTable = process.env.ITEM_TABLE
    ) { }

    async createItem(newItem: Item): Promise<Item> {
        logger.info(`Create new item: ${newItem.itemId}`);
        await this.docClient
            .put({
                TableName: this.itemTable,
                Item: newItem
            })
            .promise();
        return newItem;
    }

    async getItem(userId: string) {
        logger.info(`Getting all item for userId: ${userId}`);
        const result = await this.docClient
            .query({
                TableName: this.itemTable,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise();
        return result.Items as Item[];
    }

    async updateItem(userId: string, itemId: string, updateData: ItemUpdate): Promise<void> {
        logger.info(`Updating itemId: ${itemId}`);
        await this.docClient
            .update({
                TableName: this.itemTable,
                Key: { userId, itemId },
                ConditionExpression: 'attribute_exists(itemId)',
                UpdateExpression: 'set #content = :n, dueDate = :due, done = :dn',
                ExpressionAttributeValues: {
                    ':n': updateData.name,
                    ':due': updateData.dueDate,
                    ':dn': updateData.done
                },
                ExpressionAttributeNames: {
                    "#content": "name"
                }
            })
            .promise();
    }

    async deleteItem(userId: string, itemId: string): Promise<void> {
        logger.info(`Deleting item id: ${itemId}`);
        await this.docClient
            .delete({
                TableName: this.itemTable,
                Key: { userId, itemId }
            })
            .promise();
    }

    async setAttachmentUrl(userId: string, itemId: string, image_bucket: string): Promise<void> {
        logger.info(`Updating attachmentUrl for item: ${itemId}`);
        await this.docClient
            .update({
                TableName: this.itemTable,
                Key: { userId, itemId },
                ConditionExpression: 'attribute_exists(itemId)',
                UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues: {
                    ':attachmentUrl': `https://${image_bucket}.s3.amazonaws.com/${itemId}`
                }
            })
            .promise();
    }
}