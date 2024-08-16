/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import {getRealmInstance, Realm} from './store';
import {Expense} from './expense';

export interface WeeklyTransactionsData {
  weekday: number;
  total: number;
}

export interface TransactionsData {
  value: number;
  date: Date;
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

const getTransactions = async (period: string): Promise<TransactionsData[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const now = new Date();
      let startDate;

      if (period === 'W') {
        startDate = new Date(now.setDate(now.getDate() - 7));
      } else if (period === 'M') {
        startDate = new Date(now.setMonth(now.getMonth() - 1));
      } else if (period === 'Y') {
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      }

      const expenses = realm
        .objects<Expense>('Expense')
        .filtered('date >= $0', startDate);

      const transformedData = expenses.map(expense => ({
        value: expense.amount,
        date: expense.date,
      }));

      resolve(transformedData);
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

async function getExpenseSums() {
  const realm = await getRealmInstance();
  const now = new Date();
 
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const weeklySum = realm
    .objects('Expense')
    .filtered('date >= $0', startOfWeek)
    .sum('amount');

  const monthlySum = realm
    .objects('Expense')
    .filtered('date >= $0', startOfMonth)
    .sum('amount');

  const yearlySum = realm
    .objects('Expense')
    .filtered('date >= $0', startOfYear)
    .sum('amount');

  const weeklyData = getWeeklyData(realm, startOfWeek);  
  const monthlyData = getMonthlyData(realm); 
  const yearlyData = getYearlyData(realm, startOfYear);

  return {
    weeklySum: weeklySum || 0, 
    monthlySum: monthlySum || 0,
    yearlySum: yearlySum || 0,
    weeklyData,
    monthlyData,
    yearlyData,
  };
}

function getWeeklyData(realm: Realm, startOfWeek : Date) {
  return realm
    .objects('Expense')
    .filtered('date >= $0', startOfWeek)
    .sorted('date', false) 
    .slice(-7) 
    .map(expense => ({
      amount: expense.amount,
      date: expense.date,
    }));
}

function getMonthlyData(realm: Realm) {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-indexed (0 = January, 11 = December)
  const currentYear = today.getFullYear();
  const expenses = realm
    .objects('Expense')
    .filtered(
      'date >= $0 AND date < $1',
      new Date(currentYear, currentMonth, 1),
      new Date(currentYear, currentMonth + 1, 1)
    );

 const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
 const dailyExpenses = new Array(daysInMonth).fill(0);

 expenses.forEach(expense => {
   const day = new Date(expense.date as Date).getDate();
   dailyExpenses[day - 1] += expense.amount;
 });

 return dailyExpenses;
}

function getYearlyData(realm: Realm, startOfYear: Date) {
 const endOfYear = new Date(startOfYear.getFullYear() + 1, 0, 1); // January 1st of the next year
 const monthlyData = Array(12)
   .fill(0)
   .map((_, month) => ({
     amount: 0,
     date: new Date(startOfYear.getFullYear(), month, 1),
   }));

 realm
   .objects('Expense')
   .filtered('date >= $0 AND date < $1', startOfYear, endOfYear)
   .forEach(expense => {
     const monthIndex = (expense.date as Date).getMonth();
     monthlyData[monthIndex].amount += (expense.amount as number);
   });

 return monthlyData;
}


export {
  getDailyTransactionPercentageChange,
  getMonthlySales,
  getWeeklyTransactions,
  getDailyTransaction,
  getPreviousDayTransaction,
  getDailyTransactionTrend,
  getWeeklySales,
  getTransactions,
  getExpenseSums,
};
