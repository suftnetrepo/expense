/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Unmanaged } from 'realm';
import { DefaultObject } from 'realm/dist/public-types/schema';
import { guid } from '../utils/help';
import { getRealmInstance } from './store';
import { Category } from './category';
import { CATEGORY } from '../configs/Expense';

const userNames = ['Alice', 'Bob', 'Charlie', 'Diana'];

const generateUsers = () => {
  return userNames.map(name => ({
    user_id: guid(),
    username: 'user',
    password: 'user123',
    first_name: name,
    last_name: 'Smith',
    pass_code: 1234,
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

// Sample data for vaccines
const vaccines = [
  {
    vaccine_id: 'HepB',
    name: 'Hepatitis B (HepB)',
    description:
      'Prevents hepatitis B, a serious liver infection caused by the hepatitis B virus.',
    dosage: '3 doses: Birth, 1-2 months, 6-18 months',
  },
  {
    vaccine_id: 'DTaP',
    name: 'Diphtheria, Tetanus, and Pertussis (DTaP)',
    description:
      'Prevents diphtheria, tetanus (lockjaw), and pertussis (whooping cough).',
    dosage: '5 doses: 2 months, 4 months, 6 months, 15-18 months, 4-6 years',
  },
  {
    vaccine_id: 'Hib',
    name: 'Haemophilus influenzae type b (Hib)',
    description:
      'Prevents Haemophilus influenzae type b infections, which can cause meningitis and other serious infections.',
    dosage:
      '3 or 4 doses (depending on brand): 2 months, 4 months, 6 months (if needed), 12-15 months',
  },
  {
    vaccine_id: 'PCV13',
    name: 'Pneumococcal Conjugate (PCV13)',
    description:
      'Prevents pneumococcal disease, which can cause pneumonia, meningitis, and bloodstream infections.',
    dosage: '4 doses: 2 months, 4 months, 6 months, 12-15 months',
  },
  {
    vaccine_id: 'IPV',
    name: 'Inactivated Poliovirus (IPV)',
    description:
      'Prevents polio, a disease that can cause paralysis and meningitis.',
    dosage: '4 doses: 2 months, 4 months, 6-18 months, 4-6 years',
  },
  {
    vaccine_id: 'MMR',
    name: 'Measles, Mumps, and Rubella (MMR)',
    description:
      'Prevents measles, mumps, and rubella, which are serious viral infections.',
    dosage: '2 doses: 12-15 months, 4-6 years',
  },
  {
    vaccine_id: 'Varicella',
    name: 'Varicella (Chickenpox)',
    description: 'Prevents chickenpox, a highly contagious viral infection.',
    dosage: '2 doses: 12-15 months, 4-6 years',
  },
  {
    vaccine_id: 'HepA',
    name: 'Hepatitis A (HepA)',
    description:
      'Prevents hepatitis A, a liver disease caused by the hepatitis A virus.',
    dosage: '2 doses: 12-23 months, 6-18 months after the first dose',
  },
  {
    vaccine_id: 'RV',
    name: 'Rotavirus',
    description:
      'Prevents rotavirus infections, which can cause severe diarrhea and vomiting in infants and young children.',
    dosage:
      '2 or 3 doses (depending on brand): 2 months, 4 months, 6 months (if needed)',
  },
  {
    vaccine_id: 'Flu',
    name: 'Influenza (Flu)',
    description:
      'Prevents seasonal influenza (flu), which can cause severe respiratory illness.',
    dosage:
      'Yearly, starting at 6 months (with 2 doses given at least 4 weeks apart for the first vaccination if under 9 years old)',
  },
];


// Sample data for children
const children = [
  {
    child_id: guid(),
    first_name: 'John',
    last_name: 'Doe',
    dateOfBirth: new Date('2020-01-01'),  
    gender: 'Male',
    genotype: 'SS',
  },
  {
    child_id: guid(),
    first_name: 'Jane',
    last_name: 'Smith',  
    dateOfBirth: new Date('2021-06-15'),
    gender: 'Female',
    genotype: 'AA',
  },
  // Add more children as needed
];


const cards = () => {
  const appointments: {
    card_id: string;
    child_id: any;
    vaccine_id: string;
    date: Date;
    time: Date;
    reminder: number;
    status: number;
    provider: string;
  }[] = [];

  const daysRange = 14; // 14 days in the past and 14 days in the future

  children.forEach((child: {child_id: string}) => {
    for (let i = -daysRange; i <= daysRange; i += 7) {
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + i);

      const appointmentTime = new Date();
      appointmentTime.setHours(9 + (Math.abs(i) % 3), 0); // 9 AM, 10 AM, or 11 AM based on the day

      appointments.push({
        card_id: guid(),
        child_id: child.child_id,
        vaccine_id: vaccines[0].vaccine_id,
        date: appointmentDate,
        time: appointmentTime,
        reminder: 1,
        status: 1, // Assuming '1' means scheduled
        provider: 'Health Clinic',
      });
    }
  });

  return appointments;
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

      realm.delete(realm.objects('Vaccine'));
      realm.delete(realm.objects('Card'));
      realm.delete(realm.objects('Child'));
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

  try {
    realm.write(() => {
      realm.deleteAll();
      
      CATEGORY.forEach(category => {
        const newCategory: Category = {
          category_id: guid(),
          name: category,
          status: 0,
          color_code: '#6d28d9',
        };
     
        let existingCategory = realm.objectForPrimaryKey(
          'Category',
          newCategory.category_id
        );
        if (!existingCategory) {
          realm.create('Category', category);
        }
      });

      users.forEach(user => realm.create('User', user));
      vaccines.forEach(vaccine => realm.create('Vaccine', vaccine));
      children.forEach(child => realm.create('Child', child));
      cards().forEach(
        (card: Partial<DefaultObject> | Partial<Unmanaged<DefaultObject>>) =>
          realm.create('Card', card)
      );

      if (__DEV__) console.log('Database seeded successfully');
    });
  } catch (error) {
    if (__DEV__) {
      console.log('..................', error);
    }
  }
};

export { seedData, clearSeedData, prepareSeedData };
