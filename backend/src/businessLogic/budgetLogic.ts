import { BudgetAccess } from '../dataLayer/budget'
import { UpdateBalanceRequest } from '../requests/UpdateBalanceRequest';

const budgetAccess = new BudgetAccess();

export async function getBalance(userId: string) : Promise<number>{
    return budgetAccess.getBalance(userId)
}

export async function updateBalance(userId: string, req: UpdateBalanceRequest) :Promise<void>{
    return budgetAccess.updateBalance(userId, req)
}