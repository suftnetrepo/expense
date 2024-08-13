/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { Fragment } from 'react';
import {
    YStack,
    XStack,
    StyledText,
    StyledCard,
    StyledImage,
    StyledSpacer
} from 'fluent-styles';
import { fontStyles, theme } from '../../configs/theme';

const ReaderCard = ({ navigator, reader }) => {
    const { name, description, uri } = reader

    return (
        <Fragment>
            <StyledCard
                borderColor={theme.colors.gray[1]}
                backgroundColor={theme.colors.gray[1]}
                borderRadius={8}
                HWidth='32x4'
                pressable={true}
                pressableProps={{
                    onPress: () => {
                        navigator.navigate("article-details", {
                            reader: reader
                        })
                    }
                }}
            >
                <XStack justifyContent='space-between' alignItems='center' paddingHorizontal={8}  >
                    <StyledImage
                        local                         
                        borderRadius={8}                
                        height={70}
                        width={70}
                        source={uri}
                    />

                    <YStack flex={3} paddingHorizontal={8} paddingVertical={8} justifyContent='center' alignItems='flex-start' >
                        <StyledText
                            fontFamily={fontStyles.Roboto_Bold}
                            fontSize={theme.fontSize.normal}
                            fontWeight={theme.fontWeight.medium}
                            color={theme.colors.gray[800]}>
                            {name}
                        </StyledText>
                        <StyledText fontFamily={fontStyles.Roboto_Regular}
                            fontSize={theme.fontSize.small}
                            fontWeight={theme.fontWeight.normal}
                            color={theme.colors.gray[700]}>
                            {description}
                        </StyledText>
                    </YStack>
                </XStack>
            </StyledCard>
            <StyledSpacer marginHorizontal={4} />
        </Fragment>
       
    )
}

export { ReaderCard }