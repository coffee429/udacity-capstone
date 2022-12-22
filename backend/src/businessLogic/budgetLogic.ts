import { BudgetAccess } from '../dataLayer/budget'
import { UpdateBalanceRequest } from '../requests/UpdateBalanceRequest';
import { Budget } from '../models/Budget'
const budgetAccess = new BudgetAccess();

export async function createBudget(userId: string) {
    const createdAt = new Date().toISOString();
    const balance : number = 0;
    const newBudget: Budget = {userId, createdAt, balance};
    return budgetAccess.createBudget(newBudget);
}

export async function getBalance(userId: string) : Promise<number>{
    return budgetAccess.getBalance(userId)
}

export async function updateBalance(userId: string, req: UpdateBalanceRequest) :Promise<void>{
    return budgetAccess.updateBalance(userId, req)
}