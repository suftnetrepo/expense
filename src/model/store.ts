/* eslint-disable prettier/prettier */
import Realm, { ObjectSchema } from 'realm';
import { createRealmContext } from '@realm/react';
import { migration, SCHEMA_VERSION } from './migration';

let realmInstance: Realm | null = null;

export const UserSchema: ObjectSchema = {
  name: 'User',
  primaryKey: 'user_id',
  properties: {
    user_id: 'string',
    username: 'string',
    password: 'string',
    first_name: 'string',
    last_name: 'string',
    uri: 'string?',
    currency: 'string?',
    pass_code: 'int',
    status: {type: 'int', default: 0},
    role: 'string',
  },
};

export const ExpenseSchema: ObjectSchema = {
  name: 'Expense',
  primaryKey: 'expense_id',
  properties: {
    expense_id: 'string',
    amount: 'double',
    date: 'date',
    category_id: 'string',
    type: 'string?',
  },
};

export const CategorySchema: ObjectSchema = {
  name: 'Category',
  primaryKey: 'category_id',
  properties: {
    category_id: 'string',
    name: 'string',
    color_code: 'string?',
    status: {type: 'int', default: 0},
  },
};

const ChildSchema = {
  name: 'Child',
  primaryKey: 'child_id',
  properties: {
    child_id: 'string',
    first_name: 'string',
    last_name: 'string',
    uri: 'string?',
    dateOfBirth: 'date',
    gender: 'string',
    genotype: 'string?',
  },
};

const VaccineSchema = {
  name: 'Vaccine',
  primaryKey: 'vaccine_id',
  properties: {
    vaccine_id: 'string',
    name: 'string',
    description: 'string?',
    dosage: 'string',
  },
};

const CardSchema = {
  name: 'Card',
  primaryKey: 'card_id',
  properties: {
    card_id: 'string',
    child_id: 'string',
    vaccine_id: 'string',
    date: 'date',
    time: 'date',
    provider: 'string',
    reminder: 'int?',
    status: 'int',
  },
};

const {useRealm, useQuery, RealmProvider} = createRealmContext({
  schema: [
    UserSchema,
    CardSchema,
    ChildSchema,
    VaccineSchema,
    ExpenseSchema,
    CategorySchema,
  ],
  deleteRealmIfMigrationNeeded: true,
});

const schema = [
  UserSchema,
  CardSchema,
  ChildSchema,
  VaccineSchema,
  ExpenseSchema,
  CategorySchema,
];

const RealmOptions = () => {
  return {
    path: '_expense____z.realm',
    schema: schema,
    schemaVersion: SCHEMA_VERSION,
    migration 
  };
};

const RealmOpen = async () => {
  return await Realm.open(RealmOptions());
}

const getRealmInstance = async () => {
  if (!realmInstance) {
    realmInstance = await RealmOpen();
  }
  return realmInstance;
};

export {
  schema,
  RealmOpen,
  RealmOptions,
  useRealm,
  useQuery,
  RealmProvider,
  Realm,
  getRealmInstance,
 
};
