import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE
    ) { }

    async createTodo(newTodo: TodoItem): Promise<TodoItem> {
        logger.info(`Create new todo: ${newTodo.todoId}`);
        await this.docClient
            .put({
                TableName: this.todosTable,
                Item: newTodo
            })
            .promise();
        return newTodo;
    }

    async getTodos(userId: string) {
        logger.info(`Getting all todos for userId: ${userId}`);
        const result = await this.docClient
            .query({
                TableName: this.todosTable,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise();
        return result.Items as TodoItem[];
    }

    async updateTodo(userId: string, todoId: string, updateData: TodoUpdate): Promise<void> {
        logger.info(`Updating todoId: ${todoId}`);
        await this.docClient
            .update({
                TableName: this.todosTable,
                Key: { userId, todoId },
                ConditionExpression: 'attribute_exists(todoId)',
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

    async deleteTodo(userId: string, todoId: string): Promise<void> {
        logger.info(`Deleting todoId: ${todoId}`);
        await this.docClient
            .delete({
                TableName: this.todosTable,
                Key: { userId, todoId }
            })
            .promise();
    }

    async setAttachmentUrl(userId: string, todoId: string, image_bucket: string): Promise<void> {
        logger.info(`Updating attachmentUrl for todoId: ${todoId}`);
        await this.docClient
            .update({
                TableName: this.todosTable,
                Key: { userId, todoId },
                ConditionExpression: 'attribute_exists(todoId)',
                UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues: {
                    ':attachmentUrl': `https://${image_bucket}.s3.amazonaws.com/${todoId}`
                }
            })
            .promise();
    }
}