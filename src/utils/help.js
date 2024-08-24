/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';

export const isValidColor = value =>
  /^#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(value)
export const isValidNumber = value =>
  typeof value === 'number' && isFinite(value)
export const isValidString = value =>
  typeof value === 'string' && value.trim().length > 0

const generateRandomData = () => {
  return {
    name: faker.company.name(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    user_name: faker.internet.userName(),
    email: faker.internet.email(),
    mobile: faker.phone.number().slice(0, 12),
    password: '1234567',
    address: faker.location.streetAddress(),
    role: 'admin',
    pass_code: 1234,
  };
};

const toWordCase = (str) => {
  if (!str) return
  return str.toLowerCase().replace(/(^|\s)\S/g, (t) => t.toUpperCase());
};

const getGreetings = () => {
  const currentTime = new Date().getHours();
  let greeting;

  if (currentTime < 12) {
    greeting = "Good morning";
  } else if (currentTime < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  return greeting;
};

const dateConverter = (stringDate) => {
  const date = new Date(stringDate);
  return date.toISOString().split("T")[0]?.split("-").reverse().join("-")
};

const timeConverter = (stringDate) => {
  const date = new Date(stringDate);

  // Extract hours, minutes, and seconds
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Determine AM or PM
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;
  hours = hours.toString().padStart(2, '0');

  // Return formatted time string
  return `${hours}:${minutes} ${period}`;
};

function formatDateTime(dateTimeString) {
  const [datePart, timePart] = dateTimeString.split("T");
  const formattedDate = datePart?.split("-").reverse().join("-");
  const formattedTime = timePart?.split(".")[0];

  return `${formattedDate} ${formattedTime}`;
}

function formatCurrency(currencySymbol, amount) {
  const numericAmount = parseFloat(amount);

  if (isNaN(numericAmount)) {
    return amount;
  }

  const formattedAmount = currencySymbol + numericAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  return formattedAmount;
}

function currencySymbolMapper(currencySymbol) {
  const currencyMap = {
    "£": "gbp",
    "$": "usd",
    "aed": "aed",
    "afn": "afn",
    "all": "all",
    "amd": "amd",
    "usdc": "usdc",
    "btn": "btn",
    "ghs": "ghs",
    "eek": "eek",
    "lvl": "lvl",
    "svc": "svc",
    "vef": "vef",
    "ltl": "ltl",
    "sll": "sll",
  };

  if (currencySymbol in currencyMap) {
    return currencyMap[currencySymbol];
  } else {
    return "gbp";
  }
}

function generatePaymentId() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function guid() {
  var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
    return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
}

function calculateVaccineCompletion(data) {
  const totalCount = data.length;
  let completedCount = 0;
  let notCompletedCount = 0;

  data.forEach(record => {
    if (record.status === 1) {
      completedCount++;
    } else if (record.status === 0) {
      notCompletedCount++;
    }
  });

  const completedPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const notCompletedPercentage = totalCount > 0 ? (notCompletedCount / totalCount) * 100 : 0;

  return {
    completedPercentage,
    notCompletedPercentage,
    count: data.length,
    completedCount,
    notCompletedCount
  };
}

function addDayToDate(startDate, day = 30) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + parseInt(day));
  return endDate;
}

export { addDayToDate, calculateVaccineCompletion, guid, formatDateTime, timeConverter, getGreetings, generatePaymentId, currencySymbolMapper, generateRandomData, toWordCase, formatCurrency, dateConverter }