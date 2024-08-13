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
import AddChild from '../screens/children/add';
import EditChild from '../screens/children/edit';
import Card from '../screens/card';
import AddCard from '../screens/card/add';
import EditCard from '../screens/card/edit';
import MyCard from '../screens/myCard';
import Articles from '../screens/article';
import ArticleDetails from '../screens/article/articleDetails';

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
        name="articles"
        component={Articles}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="my-card"
        component={MyCard}
        options={{
          headerShown: false,
        }}
      />  
      <Stack.Screen
        name="edit-card"
        component={EditCard}
        options={{
          headerShown: false,
        }}
      />  
      <Stack.Screen
        name="add-card"
        component={AddCard}
        options={{
          headerShown: false,
        }}
      />  
      <Stack.Screen
        name="cards"
        component={Card}
        options={{
          headerShown: false,
        }}
      />  
      <Stack.Screen
        name="add-child"
        component={AddChild}
        options={{
          headerShown: false,
        }}
      />  
      <Stack.Screen
        name="edit-child"
        component={EditChild}
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
        name="article-details"
        component={ArticleDetails}
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
