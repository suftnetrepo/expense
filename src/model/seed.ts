/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { getRealmInstance } from './store';
import { Category } from './category';
import { CATEGORY } from '../configs/Expense';

const colorPalettes = {
  rose: ['#e11d48', '#be123c'],
  pink: ['#db2777', '#be185d'],
  fuchsia: ['#c026d3', '#a21caf'],
  purple: ['#9333ea', '#7e22ce'],
  violet: ['#7c3aed', '#6d28d9'],
  indigo: ['#4f46e5', '#4338ca'],
  blue: ['#2563eb', '#1d4ed8'],
  lightBlue: ['#0284c7', '#0369a1'],
  darkBlue: ['#005db4', '#004282'],
  cyan: ['#0891b2', '#0e7490'],
  teal: ['#0d9488', '#0f766e'],
  emerald: ['#059669', '#047857'],
  green: ['#16a34a', '#15803d'],
  lime: ['#65a30d', '#4d7c0f'],
  yellow: ['#ca8a04', '#a16207'],
  amber: ['#d97706', '#b45309'],
  orange: ['#ea580c', '#c2410c'],
  red: ['#dc2626', '#b91c1c'],
  warmGray: ['#57534e', '#44403c'],
  trueGray: ['#525252', '#404040'],
  gray: ['#52525b', '#3f3f46'],
  coolGray: ['#4b5563', '#374151'],
  blueGray: ['#475569', '#334155'],
};

const userNames = ['Alice', 'Bob', 'Charlie', 'Diana'];

const randomColor = () => {
  const colors = Object.values(colorPalettes);
  const randomPalette = colors[Math.floor(Math.random() * colors.length)];
  return randomPalette[Math.floor(Math.random() * randomPalette.length)];
};

const generateCategories = () => {
  return CATEGORY.map(category => ({
    category_id: guid(),
    name: category,
    status: 0,
    color_code: randomColor(),
  }));
}

const generateUsers = () => {
  return userNames.map(name => ({
    user_id: guid(),
    username: 'user',
    password: 'user123',
    first_name: name,
    last_name: 'Smith',
    pass_code: 1234,
    currency: '£',
    status: 1,
    role: 'user',
  }));
};

export const generateUser = () => {
  return {
    user_id: guid(),
    username: 'user',
    password: 'user123',
    first_name: 'James',
    last_name: 'Smith',
    pass_code: 1234,
    status: 1,
    role: 'user',
  };
};

export const generateExpenses = (categories : Category[]) => {

  const numbers = Array.from({length: 50}, (_, i) => i + 1);

  const getRandomDate = () => {
    const today = new Date();
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 14);
    return new Date(
      twoWeeksAgo.getTime() +
        Math.random() * (today.getTime() - twoWeeksAgo.getTime())
    );
  };

  const getRandomAmount = () => {
    return (Math.random() * 100).toFixed(2);
  };

  const getRandomType = () => {
    return Math.random() < 0.5 ? 'Credit' : 'Debit';
  };

  return numbers.map(() => {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];

    return {
      expense_id: guid(),
      amount: parseFloat(getRandomAmount()), 
      date: getRandomDate(),
      category_id: randomCategory.category_id,
      type: getRandomType(),
    };
  });
};


const clearSeedData = async () => {
  const realm = await getRealmInstance();
  realm.write(() => {
    realm.deleteAll();
  })
}
const prepareSeedData = async () => {
  const realm = await getRealmInstance();
  try {
    realm.write(() => {
      
      realm.delete(realm.objects('Category'));
      realm.delete(realm.objects('Expense'));

      if (__DEV__)
        console.log('Database seeds deleted successfully');
    });
  } catch (error) {
    if (__DEV__) {
      console.log('..................', error);
    }

  }
};

const seedData = async () => {
  const realm = await getRealmInstance();
  const users = generateUsers();
  const categories = generateCategories();
  const expenses = generateExpenses(categories);

  try {
    realm.write(() => {
      realm.deleteAll();

      categories.forEach(category => realm.create('Category', category));
      expenses.forEach(expense => realm.create('Expense', expense));
      users.forEach(user => realm.create('User', user));
      
      if (__DEV__) console.log('Database seeded successfully');
    });
  } catch (error) {
    if (__DEV__) {
      console.log('..................', error);
    }
  }
};

export { seedData, clearSeedData, prepareSeedData };
