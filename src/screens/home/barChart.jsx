/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useCallback } from 'react';
import {
    YStack,
    XStack,
    StyledText,
    StyledSpacer,
    StyledButton
} from 'fluent-styles';
import { StyledMIcon } from '../../components/icon';
import { fontStyles, theme } from '../../configs/theme';
import {
    useAggregates,
    useTransactionTrend,
    useWeeklyTransactions
} from '../../hooks/useDashboard';
import { BarChart } from 'react-native-gifted-charts';
import { useAppContext } from '../../hooks/appContext';
import { formatCurrency } from '../../utils/help';

const ExpenseBarChart = ({ period }) => {
    const { user } = useAppContext()
    const { data } = useWeeklyTransactions();
    const { trend, dailyTransaction } = useTransactionTrend()
    const { data: expenseData } = useAggregates()
    const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const chartWeekly = useCallback(() => {
        const colors = ['#FF6347', '#FFA07A', '#FFD700', '#ADFF2F', '#00FA9A', '#00CED1', '#4682B4']; // Example colors for each day
        const chartData = labels.map((label, index) => {
            const dayData = data?.find(day => day.weekday === index);
            return {
                label,
                value: dayData ? dayData.total : 0,
                frontColor: colors[index],
            };
        });

        return chartData;
    }, [data, labels]);

    const chartDaily = useCallback(() => {
        const currentDate = new Date()
        const chartData = labels.map((label, index) => {
            const dayData = data?.find(day => day.weekday === index);
            return {
                label,
                value: dayData ? dayData.total : 0,
                frontColor: index === currentDate.getDay() ? '#916aff' : '#d3d3d3',
            };
        });

        return chartData;
    }, [data, labels]);

    return (
        <YStack                 
            justifyContent="flex-start"
            alignItems="flex-start"
            backgroundColor={theme.colors.gray[1]}
            borderRadius={16}
            paddingHorizontal={8}
            marginHorizontal={2}
            paddingVertical={8}>
            <StyledSpacer marginVertical={2} />
            <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                fontSize={theme.fontSize.large}
                fontWeight={theme.fontWeight.normal}
                paddingHorizontal={8}
                color={theme.colors.gray[800]}>
                {
                    period === "W" ? "Weekly Expenses" : "Daily Expenses"
                }
            </StyledText>
            <XStack justifyContent="flex-start"
                alignItems="center">
                <StyledText
                    fontFamily={fontStyles.Roboto_Regular}
                    fontSize={theme.fontSize.xxxlarge}
                    fontWeight={theme.fontWeight.bold}
                    paddingHorizontal={8}
                    color={theme.colors.gray[800]}>
                    {formatCurrency(user.currency || '£', (period === "W" ? expenseData.weeklySum : dailyTransaction))}
                </StyledText>
                {
                    period === "D" && (
                        <StyledButton backgroundColor={trend === "up" ? theme.colors.green[500] : theme.colors.red[400]} borderColor={trend === "up" ? theme.colors.green[500] : theme.colors.red[400]}>
                            <XStack justifyContent="flex-start" paddingHorizontal={8} paddingVertical={1}
                                alignItems="center">
                                <StyledMIcon size={16} name={trend === "up" ? 'arrow-upward' : 'arrow-downward'} color={theme.colors.gray[1]} />
                            </XStack>
                        </StyledButton>
                    )
                }                
            </XStack>
            <StyledSpacer marginVertical={8} />
            <BarChart
                barWidth={22}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightgray"
                data={period === "D" ? chartDaily() : chartWeekly()}
                yAxisThickness={0}
                xAxisThickness={0}
                key={data}
            />

        </YStack>
    )
}

export default ExpenseBarChart