/* eslint-disable prettier/prettier */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/login';
import Keypad from '../screens/lock';
import BottomTabs from './BottomNavigation';
import User from '../screens/account/user'
import AddUser from '../screens/account/user/add'
import EditUser from '../screens/account/user/edit'
import HelpCenter from '../screens/account/helpCenter';
import FAQ from '../screens/account/faq';
import AddExpense from '../screens/expense/add';
import EditExpense from '../screens/expense/edit';
import Category from '../screens/account/category';
import AddCategory from '../screens/account/category/add';
import EditCategory from '../screens/account/category/edit';

const Stack = createStackNavigator();
function Navigator() {
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        name="bottom-tabs"
        component={BottomTabs}
        options={{
          headerShown: false,
        }}
      /> 
      <Stack.Screen
        name="add-category"
        component={AddCategory}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="edit-category"
        component={EditCategory}
        options={{
          headerShown: false,
        }}
      /> 
      <Stack.Screen
        name="categories"
        component={Category}
        options={{
          headerShown: false,
        }}
      />             
      <Stack.Screen
        name="add-expense"
        component={AddExpense}
        options={{
          headerShown: false,
        }}
      />  
      <Stack.Screen
        name="edit-expense"
        component={EditExpense}
        options={{
          headerShown: false,
        }}
      />         
      <Stack.Screen
        name="faq"
        component={FAQ}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="help-center"
        component={HelpCenter}
        options={{
          headerShown: false,
        }}
      />           
      
      <Stack.Screen
        name="edit-user"
        component={EditUser}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-user"
        component={AddUser}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="keypad"
        component={Keypad}
        options={{
          headerShown: false,
        }}
      />       
     
      <Stack.Screen
        name="users"
        component={User}
        options={{
          headerShown: false,
        }}
      />     
    </Stack.Navigator>
  );
}

export { Navigator }
