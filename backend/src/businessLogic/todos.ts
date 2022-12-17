import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../dataLayer/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();
export async function createTodo(userId: string, newTodoRequest: CreateTodoRequest) {
    const todoId = uuid.v4();
    const done = false;
    const createdAt = new Date().toISOString();
    const newTodo: TodoItem = { todoId, userId, createdAt, done, ...newTodoRequest };
    return todosAccess.createTodo(newTodo);
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return todosAccess.getTodos(userId);
}

export async function updateTodo(userId: string, todoId: string, updateData: UpdateTodoRequest): Promise<void> {
    return todosAccess.updateTodo(userId, todoId, updateData);
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> {
    return todosAccess.deleteTodo(userId, todoId);
}

export async function createAttachmentPresignedUrl(userId: string, todoId: string): Promise<string> {
    const s3Bucket = process.env.ATTACHMENT_S3_BUCKET;

    await todosAccess.setAttachmentUrl(userId, todoId, s3Bucket);
    return attachmentUtils.getSignedS3Url(todoId, s3Bucket);
}