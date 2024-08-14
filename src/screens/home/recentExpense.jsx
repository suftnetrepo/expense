/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
    YStack,
    XStack,
    StyledText,  
    StyledBadge,
    StyledSeparator
} from 'fluent-styles';
import { fontStyles, theme } from '../../configs/theme';
import { ScrollView } from 'react-native';
import { useAppContext } from '../../hooks/appContext';
import { dateConverter, formatCurrency, toWordCase } from '../../utils/help';
import { StyledStack } from '../../components/stack';
import { useRecentExpenses } from '../../hooks/useExpense';
import { StyledMIcon } from '../../components/icon';

const RecentExpenses=()=> {
    const { user } = useAppContext()
    const { data } = useRecentExpenses()

    const RenderCard = React.memo(({ item }) => {     
        return (
            <StyledStack borderLeftColor={item.category.color_code} paddingHorizontal={8} backgroundColor={theme.colors.gray[1]}
                paddingVertical={8} justifyContent='space-between' marginBottom={8} gap={8} borderRadius={16} alignItems='center'>
                <YStack flex={2}>
                    <XStack alignItems='center' justifyContent='flex-start'>
                        <YStack flex={1}>
                            <StyledText paddingHorizontal={5} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
                                {toWordCase(item.category.name)}
                            </StyledText>
                            <XStack flex={1}>
                                <XStack alignItems='center' justifyContent='flex-start'>
                                    <StyledMIcon size={16} name='date-range' color={theme.colors.gray[600]} />
                                    <StyledBadge
                                        color={theme.colors.indigo[800]}
                                        backgroundColor={theme.colors.indigo[50]}
                                        fontWeight={theme.fontWeight.normal}
                                        fontSize={theme.fontSize.small}
                                        paddingVertical={1}
                                        paddingHorizontal={5}
                                    >
                                        {dateConverter(item.date.toISOString())}
                                    </StyledBadge>
                                </XStack>
                            </XStack>
                        </YStack>
                    </XStack>
                </YStack>
                <XStack flex={1} justifyContent='flex-end' alignItems='center'>
                    <StyledBadge
                        color={theme.colors.green[800]}
                        backgroundColor={theme.colors.green[100]}
                        fontWeight={theme.fontWeight.medium}
                        fontSize={theme.fontSize.normal}
                        paddingVertical={1}
                        paddingHorizontal={10}
                    >
                        {formatCurrency(user.currency || "£", item.amount)}
                    </StyledBadge>
                </XStack>
            </StyledStack>
        );
    });

    return (
        <YStack flex={1}  backgroundColor={theme.colors.gray[100]}>
            <StyledSeparator left={
                <StyledText fontFamily={fontStyles.Roboto_Regular} paddingHorizontal={8} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[400]}>
                    Recent Expenses
                </StyledText>
            }></StyledSeparator>
           <ScrollView showsVerticalScrollIndicator={false}>
            {
                data.map((item, index)=> (
                    <RenderCard
                        key={index}
                        item={item}
                    />
                ))
            }
           </ScrollView> 
            
        </YStack>
    )
}

export default RecentExpenses