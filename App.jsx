/* eslint-disable prettier/prettier */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ToastProvider } from 'react-native-toast-notifications'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Navigator } from './src/navigation/AppNavigation';
import { RealmProvider } from './src/model/store'
import { StyledToast } from './src/components/toast'
import AppProvider from './src/hooks/appContext'
import RadioProvider from './src/hooks/radioContext';
import { withIAPContext } from 'react-native-iap';
import { theme } from './src/configs/theme';

function App () {
   
   return (
    <RealmProvider>
      <AppProvider>
        <ToastProvider dangerIcon={<Icon name="close" color={theme.colors.gray[1]} />}
           successIcon={<Icon name="check" color={theme.colors.gray[1]} size={18} />}
          offset={10}
          renderType={{
            custom_toast: (toast) => (
              <StyledToast toast={toast} />
            ),
          }}
        >
           <RadioProvider>
             <NavigationContainer>
               <Navigator />
             </NavigationContainer>
           </RadioProvider>
        </ToastProvider>
      </AppProvider>
    </RealmProvider>
  );
}

export default withIAPContext(App);
