import { BudgetAccess } from '../dataLayer/budget'
import { UpdateBudgetRequest } from '../requests/UpdateBudgetRequest';
import { Budget } from '../models/Budget'
const budgetAccess = new BudgetAccess();

export async function createBudget(userId: string) {
    const createdAt = new Date().toISOString();
    const balance : number = 0;
    const newBudget: Budget = {userId, createdAt, balance};
    return budgetAccess.createBudget(newBudget);
}

export async function getBudget(userId: string) : Promise<Budget[]>{
    return budgetAccess.getBudget(userId)
}

export async function updateBudget(userId: string, req: UpdateBudgetRequest) :Promise<Boolean>{
    return budgetAccess.updateBudget(userId, req)
}