/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-catch */
/* eslint-disable prettier/prettier */
import { guid } from '../utils/help';
import { getRealmInstance } from './store';

export interface Category {
  category_id: string;
  name: string;
  status: number;
  color_code?: string;
}

const insertCategory = async (
  name: string,
  status: number = 0,
  color_code : string
): Promise<Category> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const category: Category = {
          category_id: guid(),
          name,
          status,
          color_code,
        };
        realm.create('Category', category);
        resolve(category);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const queryAllCategories = async (): Promise<Category[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const categories = realm
        .objects<Category>('Category')
        .sorted('name')
        .map(category => ({
          category_id: category.category_id,
          name: category.name,
          status: category.status,
          color_code: category.color_code
        }));      
      resolve(categories);
    } catch (error) {
      reject(error);
    }
  });
};

const queryCategoriesByStatus = async (status: number): Promise<Category[]> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const categories = realm
        .objects<Category>('Category')
        .filtered('status == $0', status)
        .sorted('name')
        .map(category => ({
          category_id: category.category_id,
          name: category.name,
          status: category.status,
          color_code: category.color_code,
        }));      

      resolve(categories);
    } catch (error) {
      reject(error);
    }
  });
};

const queryCategoriesByPage = async (
  page: number,
  ITEMS_PER_PAGE: number = 10
): Promise<Category[]> => {
  try {
    const realm = await getRealmInstance();
    const offset = (page - 1) * ITEMS_PER_PAGE;
     console.log('....................offset', offset);
  console.log(
    '.................... offset + ITEMS_PER_PAGE',
    offset + ITEMS_PER_PAGE
  );
    const categories = realm
      .objects<Category>('Category')
      .sorted('name', true)
      .slice(offset, offset + ITEMS_PER_PAGE)
      .map(category => ({
        category_id: category.category_id,
        name: category.name,
        status: category.status,
        color_code: category.color_code,
      }));

      console.log('....................categories', categories.length);
    return categories;
  } catch (error) {
    throw error;
  }
};

const queryCategoryById = async (category_id: string): Promise<Category | null> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const category = realm.objectForPrimaryKey<Category>(
        'Category',
        category_id,
      );
      resolve(
        category
          ? {
              category_id: category.category_id,
              name: category.name,
              status: category.status,
              color_code: category.color_code,
            }
          : null
      );
    } catch (error) {
      reject(error);
    }
  });
};

const updateSingleCategory = async (
  category_id: number,
  status: number, 
): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const category = realm.objectForPrimaryKey<Category>(
          'Category',
          category_id
        );

        if (category) {       
          category.status = status;         
          resolve(true);
        } else {
          reject(false);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateCategory = async (
  category_id: number,
  name: string,
  status: number,
  color_code: string
): Promise<Category> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      realm.write(() => {
        const category = realm.objectForPrimaryKey<Category>(
          'Category',
          category_id
        );        
      
        if (category) {
          category.name = name;
          category.status = status;
          category.color_code = color_code;
          resolve(category);
        } else {
          reject(new Error('Category not found'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteCategory = async (category_id: number): Promise<boolean> => {
  const realm = await getRealmInstance();
  return new Promise((resolve, reject) => {
    try {
      const products = realm
        .objects('Expense')
        .filtered('category_id == $0', category_id);
      if (products.length > 0) {
        reject(
          new Error(
            'Cannot delete category: Expenses are associated with this category.'
          )
        );
      } else {
        realm.write(() => {
          const category = realm.objectForPrimaryKey<Category>(
            'Category',
            category_id,
          );
          if (category) {
            realm.delete(category);
            resolve(true);
          } else {
            reject(new Error('Category not found'));
          }
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export {
  insertCategory,
  updateCategory,
  queryAllCategories,
  queryCategoryById,
  deleteCategory,
  queryCategoriesByStatus,
  updateSingleCategory,
  queryCategoriesByPage,
};