/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateItemRequest {
  name: string
  dueDate: string
  done: boolean
}