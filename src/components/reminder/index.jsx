/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React from 'react';
import { YStack, XStack, StyledText, StyledCycle } from 'fluent-styles';
import { theme, fontStyles } from '../../configs/theme';
import { useNavigation } from '@react-navigation/native';
import { StyledMIcon } from '../icon';
import { useQueryCardsByDate } from '../../hooks/useCard';

const Reminder = () => {
    const navigator = useNavigation()
    const { data } = useQueryCardsByDate()

    if (!data.count) return null

    const RenderCard = ({count}) => {      
        return (
            <XStack paddingHorizontal={8} backgroundColor={theme.colors.pink[300]}
                paddingVertical={8} justifyContent='flex-start' marginBottom={8} gap={8} borderRadius={16} alignItems='center' >
                <StyledCycle borderWidth={1} borderColor={theme.colors.pink[300]} backgroundColor={theme.colors.pink[300]}>
                    <StyledMIcon size={48} name='notifications-active' color={theme.colors.gray[1]} onPress={() => navigator.navigate("cards", {

                    })} />
                </StyledCycle>
                <YStack flex={1}>
                    <StyledText fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.normal} color={theme.colors.gray[1]}>
                        Reminder
                    </StyledText>
                    <StyledText  fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.medium} fontSize={theme.fontSize.small} color={theme.colors.gray[1]}>
                        You have {count} appointments coming up soon!
                    </StyledText>
                </YStack>                  
                <StyledCycle borderWidth={1} borderColor={theme.colors.pink[300]} backgroundColor={theme.colors.pink[400]}>
                    <StyledMIcon size={24} name='chevron-right' color={theme.colors.pink[100]} onPress={() => navigator.navigate("my-card", {
                        data: data.cards
                    })} />
                </StyledCycle>
            </XStack>
        )
    }

    return (
        <RenderCard count={data.count}  />
    )
}

export default Reminder