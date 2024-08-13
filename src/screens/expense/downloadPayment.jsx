/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
    XStack,
    StyledText,
    StyledSpacer,
    StyledButton,
    StyledCycle
} from 'fluent-styles';
import { StyledMIcon } from '../../components/icon';
import { fontStyles, theme,palettes } from '../../configs/theme';
import { convertJsonToCsv } from '../../utils/convertJsonToCsv';
import { formatCurrency } from '../../utils/help';

const DownloadExpense = ({ data, currency }) => {
    const total = data.reduce((total, pay) => total + pay.amount, 0);
    return (
        <XStack absolute bottom={1} backgroundColor={palettes.transparent} >           
            <StyledButton borderRadius={16} flex={1} borderColor={theme.colors.gray[600]} backgroundColor={theme.colors.gray[600]} onPress={async () => data?.length && await convertJsonToCsv(data)}>
                <XStack justifyContent='flex-end' alignItems='center' paddingHorizontal={8} paddingVertical={8}>
                    <StyledCycle width={30} height={30} borderWidth={1} borderColor={theme.colors.gray[1]} backgroundColor={theme.colors.gray[600]}>
                        <StyledMIcon size={16} name='share' color={theme.colors.orange[100]} />
                    </StyledCycle>
                    <StyledSpacer marginHorizontal={8} />
                    <StyledText color={theme.colors.gray[1]} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.large} >
                        {formatCurrency(currency || "£", total)}
                    </StyledText>
                </XStack>
                <StyledSpacer marginHorizontal={8} />
            </StyledButton>
        </XStack>
    )
}

export { DownloadExpense }