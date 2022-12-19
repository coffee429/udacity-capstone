import { BudgetAccess } from '../dataLayer/budget'

const budgetAccess = new BudgetAccess();

export async function getBalance(userId: string) : Promise<number>{
    return budgetAccess.getBalance(userId)
}

export async function updateBalance(userId: string, amount: number) :Promise<void>{
    return budgetAccess.updateBalance(userId, amount)
}