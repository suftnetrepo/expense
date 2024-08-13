/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React from 'react';
import { YStack, XStack, StyledText, StyledBackgroundImage, StyledSpacer, StyledButton } from 'fluent-styles';
import { theme, fontStyles } from '../../configs/theme';
import { useNavigation } from '@react-navigation/native';
import { useQueryCardByStatus } from '../../hooks/useCard';

const ScheduleReminder = () => {
    const navigator = useNavigation()
    const { data } = useQueryCardByStatus(0)
   
    if (data.length > 0) return null

    const RenderCard = () => {
        return (
            <YStack relative height={150} borderRadius={16}   backgroundColor={theme.colors.lightBlue[50]} justifyContent='flex-start' alignItems='flex-start'>
                <StyledBackgroundImage absolute borderRadius={16} marginTop={-0} borderWidth={0} height={150} width={'100%'} resizeMode='cover' source={require("../../../assets/img/v_3.png")} >               
                    <XStack borderRadius={16} justifyContent='flex-start' alignItems='flex-start' backgroundColor={theme.colors.transparent05} >                 
                        <YStack justifyContent='flex-end' alignItems='flex-end' flex={2} paddingVertical={16} paddingHorizontal={16}>
                        <StyledText fontFamily={fontStyles.Roboto_Regular} textAlign='left' fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal} color={theme.colors.gray[1]} >
                            It appears you haven’t scheduled a vaccine appointment yet. Would you like to set one up now?
                        </StyledText>
                        <StyledSpacer marginVertical={8} />
                            <StyledButton backgroundColor={theme.colors.lightBlue[50]} borderColor={theme.colors.lightBlue[800]} onPress={() => navigator.navigate("bottom-tabs", { screen: 'Children' })}>
                            <StyledText fontFamily={fontStyles.Roboto_Regular} paddingVertical={5} paddingHorizontal={10} color={theme.colors.lightBlue[800]} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.medium} > Schedule</StyledText>
                        </StyledButton>
                    </YStack>
                </XStack>
                </StyledBackgroundImage>
            </YStack>
        )
    }

    return (
        <RenderCard count={data.count} />
    )
}

export default ScheduleReminder