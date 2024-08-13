/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import {getRealmInstance} from './store';
import {Expense} from './expense';

export interface WeeklyTransactionsData {
  weekday: number;
  total: number;
}

const getDailyTransaction = async (): Promise<number> => {
    const realm = await getRealmInstance();
    return new Promise((resolve, reject) => {
        try {
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0); 

          const endOfDay = new Date();
          endOfDay.setHours(23, 59, 59, 999); 
          const result = realm
            .objects<Expense>('Expense')
            .filtered('date >= $0 && date <= $1', startOfDay, endOfDay)
            .sum('amount');     

          resolve(result);
        } catch (error) {
            reject(error);
        } 
    });
};

const getDailyTransactionPercentageChange = async (): Promise<number> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const startOfYesterday = new Date(yesterday);
      startOfYesterday.setHours(0, 0, 0, 0);
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);

      const todayTotal = realm
        .objects<Expense>('Expense')
        .filtered('date >= $0 && date <= $1', today, endOfToday)
        .sum('amount');
      const yesterdayTotal = realm
        .objects<Expense>('Expense')
        .filtered('date >= $0 && date <= $1', startOfYesterday, endOfYesterday)
        .sum('amount');

      let percentageChange: number;
      if (yesterdayTotal === 0) {
        percentageChange = todayTotal === 0 ? 0 : 100;
      } else {
        percentageChange =
          ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
      }
      resolve(parseFloat(percentageChange.toFixed(2)));
    } catch (error) {
      reject(error);
    }
  });
};

const getMonthlySales = async (): Promise<number> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      const result = realm
        .objects<Expense>('Expense')
        .filtered('date >= $0 && date <= $1', startOfMonth, endOfMonth)
        .sum('amount');
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const getWeeklySales = async (): Promise<number> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const now = new Date();
      const startOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay()
      );
      const endOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay() + 6,
        23,
        59,
        59,
        999
      );

      const result = realm
        .objects<Expense>('Expense')
        .filtered('date >= $0 && date <= $1', startOfWeek, endOfWeek)
        .sum('amount');
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const getWeeklyTransactions = async (): Promise<WeeklyTransactionsData[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 6);
      lastWeek.setHours(0, 0, 0, 0);

      const expenses = realm
        .objects<Expense>('Expense')
        .filtered('date >= $0', lastWeek);

      const result = expenses
        .map(expense => ({
          weekday: new Date(expense.date).getDay(),
          total: expense.amount,
        }))
        .reduce<{weekday: number; total: number}[]>((acc, curr) => {
          const existingDay = acc.find(day => day.weekday === curr.weekday);
          if (existingDay) {
            existingDay.total += curr.total;
          } else {
            acc.push({weekday: curr.weekday, total: curr.total});
          }
          return acc;
        }, [])
        .sort((a, b) => a.weekday - b.weekday);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const getPreviousDayTransaction = async (): Promise<number> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0); // Start of yesterday
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999); // End of yesterday

      const result = realm
        .objects<Expense>('Expense')
        .filtered('date >= $0 && date <= $1', yesterday, endOfYesterday)
        .sum('amount');

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const getDailyTransactionTrend = (): Promise<{
  dailyTransaction: number;
  trend: string;
  percentageChange: number;
}> => {
  return new Promise((resolve, reject) => {
    Promise.all([getDailyTransaction(), getPreviousDayTransaction()])
      .then(([dailyTransaction, previousDayTransaction]) => {
        let trend = 'neutral';
        let percentageChange = 0;

        if (previousDayTransaction === 0) {         
          percentageChange = dailyTransaction === 0 ? 0 : 100;
          trend = dailyTransaction === 0 ? 'neutral' : 'up';
        } else {
        
          percentageChange =
            ((dailyTransaction - previousDayTransaction) /
              previousDayTransaction) *
            100;
          percentageChange = Math.round(percentageChange * 100) / 100; 
          if (dailyTransaction > previousDayTransaction) {
            trend = 'up';
          } else if (dailyTransaction < previousDayTransaction) {
            trend = 'down';
          }
        }

        resolve({dailyTransaction, trend, percentageChange});
      })
      .catch(error => reject(error));
  });
};



export {
  getDailyTransactionPercentageChange,
  getMonthlySales,
  getWeeklyTransactions,
  getDailyTransaction,
  getPreviousDayTransaction,
  getDailyTransactionTrend,
  getWeeklySales
};
