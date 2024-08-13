/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React from 'react';
import { StyledSeparator, XStack, YStack, StyledSpacer, StyledText, StyledButton } from 'fluent-styles';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { VACCINES } from '../../configs/vaccines';
import { theme } from '../../configs/theme';
import { ReaderCard } from './readerCard';

const Article = () => {
    const navigator = useNavigation()

    return (
        <YStack>
            <StyledSeparator left={
                <XStack
                    backgroundColor={theme.colors.gray[100]}
                    justifyContent="space-between"
                    alignItems="center">
                    <StyledText fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[500]}>
                        Articles
                    </StyledText>
                    <StyledSpacer flex={1} />
                    <StyledButton link onPress={() => navigator.navigate("articles") }>
                        <StyledText fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
                            View All
                        </StyledText>
                    </StyledButton>                   
                </XStack>

            }></StyledSeparator>
            <FlatList
                data={VACCINES.slice(0,3)}
                horizontal
                initialNumToRender={100}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.vaccine_id}
                renderItem={({ item, index }) => {
                    return (
                        <ReaderCard navigator={navigator} reader={item} key={`${index}-${item.vaccine_id}`} />
                    )
                }}
            />
        </YStack>
    )
}

export default Article