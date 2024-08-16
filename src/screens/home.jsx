/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */

import React, { useState } from 'react';
import {
  YStack,
  XStack,
  StyledSafeAreaView,
  StyledCycle,
  StyledText,
  StyledHeader,
  StyledSpacer,
  StyledDialog,
  StyledButton
} from 'fluent-styles';
import { StyledMIcon } from '../components/icon';
import { fontStyles, theme } from '../configs/theme';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useAppContext } from '../hooks/appContext';
import { getGreetings, toWordCase } from '../utils/help';
import { state } from '../store';
import { useSelector } from '@legendapp/state/react';
import { PurchaseSuccess } from './home/purchaseSuccess';
import ExpenseChart from './home/lineChart';
import { StyledToggleSwitch } from '../components/toggleSwitch';
import ExpenseBarChart from './home/barChart';
import RecentExpenses from './home/recentExpense';
import { useInAppPurchase } from '../hooks/useInAppPurchase';
import { ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const Home = () => {
  const navigate = useNavigation();
  const { purchaseHandler } = useInAppPurchase();
  const { user } = useAppContext();
  const [key, setKey] = useState(false)
  const [period, setPeriod] = useState("D")
  const { payment_status, purchase_status } = useSelector(() => state.get());

  useFocusEffect(
    React.useCallback(() => {        
      setKey(true)
      return () => {   
        setKey(false)
      };
    }, [])
  );
  
  const RenderHeader = () => {
    return (
      <XStack
        flex={1}
        backgroundColor={theme.colors.gray[100]}
        justifyContent="space-between"
        alignItems="center"
        paddingVertical={8}
        paddingHorizontal={8}>
        <YStack>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.normal}
            fontWeight={theme.fontWeight.normal}
            color={theme.colors.gray[400]}>
            {getGreetings()}
          </StyledText>
          <StyledText
            fontFamily={fontStyles.Roboto_Regular}
            fontSize={theme.fontSize.normal}
            fontWeight={theme.fontWeight.bold}
            color={theme.colors.gray[800]}>
            {toWordCase(user.first_name)} {toWordCase(user.last_name)}
          </StyledText>
        </YStack>
        <XStack>
          {
            !purchase_status && (
              <StyledButton backgroundColor={theme.colors.orange[400]} onPress={async () => await purchaseHandler()}>
                <XStack justifyContent='flex-end' alignItems='center' paddingHorizontal={12} >
                  <StyledMIcon size={24} name='apps' color={theme.colors.gray[1]} />
                  <StyledSpacer marginHorizontal={2} />
                  <StyledText color={theme.colors.gray[1]} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.normal} >
                    Buy
                  </StyledText>
                </XStack>
              </StyledButton>
            )
          }         
          <StyledSpacer marginHorizontal={2} />
          <StyledCycle
            paddingHorizontal={10}
            borderWidth={1}
            borderColor={theme.colors.gray[1]}>
            <StyledMIcon
              size={30}
              name="lock-clock"
              color={theme.colors.gray[800]}
              onPress={() =>
                navigate.reset({
                  index: 0,
                  routes: [{ name: 'keypad', params: { recovery_password: false } }],
                })
              }
            />
          </StyledCycle>
          <StyledSpacer marginHorizontal={4} />
          <StyledCycle
            paddingHorizontal={10}
            borderWidth={1}
            borderColor={theme.colors.gray[1]}>
            <StyledMIcon
              size={30}
              name="exit-to-app"
              color={theme.colors.gray[800]}
              onPress={() => {
                navigate.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'login' }],
                  })
                );
              }}
            />
          </StyledCycle>
          <StyledSpacer marginHorizontal={4} />
        </XStack>
      </XStack>
    );
  };

  return (
    <StyledSafeAreaView flex={1}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }}>
        <StyledHeader.Full>
          <RenderHeader />
        </StyledHeader.Full>
      </StyledHeader> 
      <StyledSpacer marginVertical={4} />
      <ScrollView key={key} showsVerticalScrollIndicator={false}>
        <YStack flex={1} marginHorizontal={8}>
          <StyledToggleSwitch onPress={(label) => setPeriod(label)} />
          <StyledSpacer marginVertical={4} />
          {
            ["D", "W"].includes(period) && (
              <ExpenseBarChart period={period} />
            )
          }
          {
            ["M", "Y"].includes(period) && (
              <ExpenseChart  period={period} />
            )
          }          
          <RecentExpenses  />
        </YStack>    
      </ScrollView>        
      {payment_status &&
        <StyledDialog visible>
          <PurchaseSuccess />
        </StyledDialog>}

    </StyledSafeAreaView>
  );
};

export default Home;
