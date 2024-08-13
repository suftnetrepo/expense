/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */
/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { getRealmInstance } from './store';
import { Category, queryCategoryById } from './category';

export interface Expense {
    expense_id: string;
    amount: 'double';
    date: 'date';
    category_id: 'string';
    category?: Category | null;
    type: 'string';
}

const insertExpense = async (
    expense: Omit<Expense, 'expense_id'>
): Promise<Expense> => {
    const realm = await getRealmInstance();
    return new Promise((resolve, reject) => {
        try {
            realm.write(() => {
                const newExpense = {
                    expense_id: guid(),
                    ...expense,
                };
                realm.create('Expense', newExpense);
                resolve(newExpense);
            });
        } catch (error) {
            reject(error);
        }
    });
};

const queryAllExpenses = async (): Promise<Expense[]> => {
    try {
        const realm = await getRealmInstance();
        const expenses = realm.objects<Expense>('Expense').sorted('date');

        const cards = await Promise.all(
            expenses.map(async expense => {
                const category = (await queryCategoryById(expense.category_id)) || null;

                return {
                    expense_id: expense.expense_id,
                    category_id: expense.category_id,
                    category: category,
                    type: expense.type,
                    amount: expense.amount,
                    date: expense.date,
                };
            })
        );

        return cards;
    } catch (error) {
        throw error;
    }
};

const queryExpensesByDateRange = async (
    startDate: Date,
    endDate: Date
): Promise<Expense[]> => {
    try {
        const realm = await getRealmInstance();
        const expenses = realm
            .objects<Expense>('Expense')
            .filtered('date >= $0 AND date <= $1', startDate, endDate)
            .sorted('date', true);
        const cards = await Promise.all(
            expenses.map(async expense => {
                const category =
                    (await queryCategoryById(expense.category_id)) || null;

                return {
                    expense_id: expense.expense_id,
                    category_id: expense.category_id,
                    category: category,
                    type: expense.type,
                    amount: expense.amount,
                    date: expense.date,
                };
            })
        );

        return cards;
    } catch (error) {
        throw error;
    }
};

const updateExpense = async (expense: Expense): Promise<Expense> => {
    const realm = await getRealmInstance();
    return new Promise((resolve, reject) => {
        try {
            realm.write(() => {
                const updatedExpense = realm.objectForPrimaryKey<Expense>(
                    'Expense',
                    expense.expense_id
                );
                if (updatedExpense) {
                    (updatedExpense.expense_id = expense.expense_id),
                        (updatedExpense.category_id = expense.category_id),
                        (updatedExpense.type = expense.type),
                        (updatedExpense.amount = expense.amount),
                        (updatedExpense.date = expense.date),
                        resolve(updatedExpense);
                } else {
                    reject(new Error('Expense not found'));
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

const deleteExpense = async (expense_id: string): Promise<boolean> => {
    const realm = await getRealmInstance();
    return new Promise((resolve, reject) => {
        try {
            realm.write(() => {
                const expense = realm.objectForPrimaryKey<Expense>(
                    'Expense',
                    expense_id
                );
                if (expense) {
                    realm.delete(expense);
                    resolve(true);
                } else {
                    reject(new Error('Expense not found'));
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

export {
    insertExpense,
    updateExpense,
    queryAllExpenses,
    queryExpensesByDateRange,
    deleteExpense
};