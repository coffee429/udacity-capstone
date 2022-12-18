import { ItemAccess } from '../dataLayer/item'
import { AttachmentUtils } from '../dataLayer/attachmentUtils';
import { Item } from '../models/Item'
import { CreateItemRequest } from '../requests/CreateItemRequest'
import { UpdateItemRequest } from '../requests/UpdateItemRequest'
import * as uuid from 'uuid'

const itemAccess = new ItemAccess();
const attachmentUtils = new AttachmentUtils();
export async function createItem(userId: string, newItemRequest: CreateItemRequest) {
    const itemId = uuid.v4();
    const done = false;
    const createdAt = new Date().toISOString();
    const newItem: Item = { itemId, userId, createdAt, done, ...newItemRequest };
    return itemAccess.createItem(newItem);
}

export async function getItemForUser(userId: string): Promise<Item[]> {
    return itemAccess.getItem(userId);
}

export async function updateItem(userId: string, itemId: string, updateData: UpdateItemRequest): Promise<void> {
    return itemAccess.updateItem(userId, itemId, updateData);
}

export async function deleteItem(userId: string, itemId: string): Promise<void> {
    return itemAccess.deleteItem(userId, itemId);
}

export async function createAttachmentPresignedUrl(userId: string, itemId: string): Promise<string> {
    const s3Bucket = process.env.ATTACHMENT_S3_BUCKET;

    await itemAccess.setAttachmentUrl(userId, itemId, s3Bucket);
    return attachmentUtils.getSignedS3Url(itemId, s3Bucket);
}