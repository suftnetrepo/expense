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
    StyledSpacer,    
} from 'fluent-styles';
import { fontStyles, theme } from '../../configs/theme';
import {
    useAggregates, 
} from '../../hooks/useDashboard';
import { LineChart } from 'react-native-gifted-charts';
import { useWindowDimensions } from 'react-native';
import { useAppContext } from '../../hooks/appContext';
import { formatCurrency } from '../../utils/help';

const ExpenseChart = ({ period }) => {
    const { width } = useWindowDimensions()
    const { user } = useAppContext()
    const { data: expenseData } = useAggregates()
    
    let chartData = [];
    let labels = [];
    
    if (period === 'M') {
        chartData = expenseData.monthlyData?.map(expense => ({
            value: expense.amount,
        }));
        
    } else if (period === 'Y') 
      {
        chartData = expenseData.yearlyData?.map(expense => ({
            value: expense.amount,
        }));
        labels = expenseData.yearlyData?.map(expense =>
            expense.date.toLocaleString('default', { month: 'short' })
        ); 
    }   
    
    const label = ({ period })=> {
        switch (period) {           
            case "M":
                return "Monthly Expenses";
            case "Y":
                return "Yearly Expenses";
            default:
                return "Expenses";
        }
        }

    const amount = ({ period }) => {
        switch (period) {           
            case "M":
                return formatCurrency(user.currency || '£', expenseData.monthlySum);
            case "Y":
                return formatCurrency(user.currency || '£', expenseData.yearlySum);
            default:
                return formatCurrency(user.currency, 0); 
        }        
    }  

    return (
        <YStack
            justifyContent="flex-start"
            alignItems="flex-start"
            backgroundColor={theme.colors.gray[1]}
            borderRadius={16}
            paddingHorizontal={8}
            paddingVertical={8}>
            <StyledSpacer marginVertical={2} />
            <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                fontSize={theme.fontSize.large}
                fontWeight={theme.fontWeight.normal}
                paddingHorizontal={8}
                color={theme.colors.gray[800]}>
                {label({period})}
            </StyledText>
            <XStack justifyContent="flex-start"
                alignItems="center">
                <StyledText
                    fontFamily={fontStyles.Roboto_Regular}
                    fontSize={theme.fontSize.xxxlarge}
                    fontWeight={theme.fontWeight.bold}
                    paddingHorizontal={8}
                    color={theme.colors.gray[800]}>
                    {amount({period})}
                </StyledText>
            </XStack>
            <StyledSpacer marginVertical={8} />
            {chartData?.length > 0 && (
                <LineChart
                    initialSpacing={0}
                    data={chartData}
                    // width={width - 50}
                    spacing={width / (chartData.length - 1)}
               
                    thickness={3}
                    hideRules
                    hideYAxisText
                    yAxisColor="#0BA5A4"
                    showVerticalLines
                    verticalLinesColor="rgba(14,164,164,0.5)"
                    xAxisColor="#0BA5A4"
                    color="#916aff"
                    curved={true}
                    showXAxisIndices
                    xAxisIndicesHeight={2}
                    xAxisLabelTextStyle={{ color: 'gray', fontSize: 10 }}
                    xAxisLabelTexts={labels} // Display the labels
                />
            )}
        </YStack>
    )
}

export default ExpenseChart