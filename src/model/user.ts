/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */
/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { getRealmInstance } from './store';

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  role: string;
  currency: string;
  pass_code: number;
  active?: boolean
}

const insertUser = async (
  first_name: string,
  last_name: string,
  username: string,
  password: string,
  role: string,
  currency: string,
  pass_code: number
): Promise<User> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const user = realm.create('User', {
          user_id: guid(),
          username,
          password,
          role,
          pass_code,
          first_name,
          last_name,
          currency,
        });
        resolve(user);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateUser = async (
  first_name: string,
  last_name: string,
  user_id: number,
  username: string,
  password: string,
  role: string,
  currency: string,
  pass_code: number
): Promise<User> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const user = realm.objectForPrimaryKey<User>('User', user_id);
        if (user) {
          user.username = username;
          user.password = password;
          user.role = role;
          user.pass_code = pass_code;
          user.first_name = first_name;
          user.last_name = last_name;
          user.currency = currency;
          resolve(user);
        } else {
          reject(new Error('User not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUser = async (user_id: number): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const user = realm.objectForPrimaryKey('User', user_id);
        if (user) {
          realm.delete(user);
          resolve(true);
        } else {
          reject(new Error('User not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryUsers = async (): Promise<User[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const users = realm.objects<User>('User').map(user => ({
        user_id: user.user_id,
        username: user.username,
        password: user.password,
        role: user.role,
        pass_code: user.pass_code,
        first_name: user.first_name,
        last_name: user.last_name,
        currency: user.currency,
      }));
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

const loginUser = async (username: string, password: string): Promise<User> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const user = realm
        .objects<User>('User')
        .filtered('username == $0 AND password == $1', username, password)[0];
      if (user) {
        user.active = true
        resolve(user);
      } else {
        reject(new Error('Invalid username or password'));
      }
    } catch (error) {
      reject(error);
    }
  });
};
const loginByPin = async (pin: number): Promise<User> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const user = realm
        .objects<User>('User')
        .filtered('pass_code == $0', pin)[0];
      if (user) {
        user.active = true
        resolve(user);
      } else {
        reject(new Error('Invalid pin'));
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updatePassCode = async (user: User): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const updateUser = realm.objectForPrimaryKey<User>(
          'User',
          user.user_id
        );
        if (updateUser) {
          updateUser.pass_code = user.pass_code;
          resolve(true);
        } else {
          reject(new Error('User not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const createUser = async (
  user: Omit<User, 'user_id'>
): Promise<true> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        realm.create('User', {
          user_id: guid(),
          ...user,
        });

        resolve(true);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export {
  updatePassCode,
  createUser,
  insertUser,
  updateUser,
  deleteUser,
  queryUsers,
  loginUser,
  loginByPin,
};
