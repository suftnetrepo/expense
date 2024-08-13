/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */

import React from 'react';
import {
  YStack,
  XStack,
  StyledSafeAreaView,
  StyledCycle,
  StyledText,
  StyledHeader,
  StyledSpacer,
  StyledDialog,
} from 'fluent-styles';
import { StyledMIcon } from '../components/icon';
import { fontStyles, theme } from '../configs/theme';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useAppContext } from '../hooks/appContext';
import { getGreetings, toWordCase } from '../utils/help';
import { PurchaseButton } from './home/purchaseButton';
import { state } from '../store';
import { useSelector } from '@legendapp/state/react';
import { PurchaseSuccess } from './home/purchaseSuccess';
import VaccineCard from '../components/vaccineCard';
import Reminder from '../components/reminder';
import Article from '../components/article';
import ScheduleReminder from '../components/scheduleAppointment';


const Home = () => {
  const navigate = useNavigation();
  const { user } = useAppContext();
  const { payment_status, purchase_status } = useSelector(() => state.get());

  const RenderHeader = () => {
    return (
      <XStack
        flex={1}
        backgroundColor={theme.colors.gray[100]}
        justifyContent="space-between"
        alignItems="center"
        paddingVertical={8}
        paddingHorizontal={16}>
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
                  routes: [{ name: 'keypad', params: { recovery_password : true } }],
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
      <YStack flex={1}  paddingHorizontal={16}>  
        <StyledSpacer marginVertical={4} />
        <ScheduleReminder />     
        <StyledSpacer marginVertical={4} />   
        <Reminder />      
        <VaccineCard />      
        <Article />
      </YStack>        
      {
        !purchase_status && (
          <PurchaseButton />
        )
      }
      {payment_status &&
        <StyledDialog visible>
          <PurchaseSuccess />
        </StyledDialog>}

    </StyledSafeAreaView>
  );
};

export default Home;
