/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { getRealmInstance } from './store';

export interface Child {
  child_id: string;
  first_name: string;
  last_name: string;
  uri?: string;
  age: number;
  dateOfBirth: Date;
  gender: string;
  genotype?: string;
}

const insertChild = async (
  child: Omit<Child, 'child_id'>
): Promise<Child> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const newChild = {
          child_id: guid(),
          ...child,
        };
        realm.create('Child', newChild);
        resolve(newChild);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryAllChildren = async (): Promise<Child[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const children = realm
        .objects<Child>('Child')
        .sorted('first_name')
        .map(child => ({
          child_id: child.child_id,
          first_name: child.first_name,
          last_name: child.last_name,
          uri: child.uri,
          age: child.age,
          genotype: child.genotype,
          dateOfBirth: child.dateOfBirth,
          gender: child.gender,
        }));
      resolve(children);
    } catch (error) {
      reject(error);
    }
  });
};

const queryChildById = async (child_id: string): Promise<Child | null> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const child = realm.objectForPrimaryKey<Child>('Child', child_id);
      resolve(
        child
          ? {
              child_id: child.child_id,
              first_name: child.first_name,
              last_name: child.last_name,
              genotype: child.genotype,
              age: child.age,
              uri: child.uri,
              dateOfBirth: child.dateOfBirth,
              gender: child.gender,
            }
          : null
      );
    } catch (error) {
      reject(error);
    }
  });
};

const updateChild = async (child: Child): Promise<Child> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const updateChild = realm.objectForPrimaryKey<Child>('Child', child.child_id);
        if (updateChild) {
          updateChild.first_name = child.first_name;
          updateChild.last_name = child.last_name;
          updateChild.uri = child.uri;
          updateChild.genotype = child.genotype;
          updateChild.age = child.age;
          updateChild.gender = child.gender;
          updateChild.dateOfBirth = child.dateOfBirth;
          resolve(updateChild);
        } else {
          reject(new Error('Child not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteChild = async (child_id: string): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const child = realm.objectForPrimaryKey<Child>('Child', child_id);
        if (child) {
          realm.delete(child);
          resolve(true);
        } else {
          reject(new Error('Child not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertChild,
  updateChild,
  queryAllChildren,
  deleteChild,
  queryChildById,
};