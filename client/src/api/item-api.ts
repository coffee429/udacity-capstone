import { apiEndpoint } from '../config'
import { Item } from '../types/Item';
import { CreateItemRequest } from '../types/CreateItemRequest';
import Axios from 'axios'
import { UpdateItemRequest } from '../types/UpdateItemRequest';
import { UpdateBudgetRequest } from '../types/UpdateBudgetRequest';

export async function getItem(idToken: string): Promise<Item[]> {
  console.log('Fetching items')

  const response = await Axios.get(`${apiEndpoint}/item`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  return response.data.item
}

export async function createItem(
  idToken: string,
  newItem: CreateItemRequest
): Promise<Item> {
  const response = await Axios.post(`${apiEndpoint}/item`,  JSON.stringify(newItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.newItem
}

export async function patchItem(
  idToken: string,
  itemId: string,
  updatedItem: UpdateItemRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/item/${itemId}`, JSON.stringify(updatedItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteItem(
  idToken: string,
  itemId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/item/${itemId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  itemId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/item/${itemId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}

export async function getBalance(idToken: string): Promise<number> {
  try{
    const response = await Axios.get(`${apiEndpoint}/budget`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
    })
    console.log('Balance:', (response.data.budget)[0].balance)
    return (response.data.budget)[0].balance
  }  catch(e) {
    alert("You dont have budget. Please create your budget first")
  }
  return 0
}

export async function createBudget(idToken: string) {
  console.log('Add new budget for new user')
  return Axios.post(`${apiEndpoint}/budget`, null, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
}

export async function updateBudget(idToken: string, updateRequest: UpdateBudgetRequest) : Promise<Boolean> {
  console.log('Update budget')
    const response = await Axios.patch(`${apiEndpoint}/budget`, updateRequest, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  return response.data.status
}