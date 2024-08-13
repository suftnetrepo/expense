/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React from 'react';
import { YStack, XStack, StyledText, StyledImage, StyledHeader, StyledCard, StyledSpacer, StyledSafeAreaView } from 'fluent-styles';
import { fontStyles, theme } from '../../configs/theme';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native';
import { VACCINES } from '../../configs/vaccines';

const Articles=()=> {
    const navigator = useNavigation()

    const ReaderCard = ({ navigator, reader }) => {
        const { name, description, uri } = reader

        return (
            <>
                <StyledCard
                    borderColor={theme.colors.gray[1]}
                    backgroundColor={theme.colors.gray[1]}
                    borderRadius={8}
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
                            flex={1}
                            borderRadius={8}
                            height={90}
                            width={80}
                            source={uri}
                        />

                        <YStack flex={2} paddingHorizontal={8} paddingVertical={8} justifyContent='center' alignItems='flex-start' >
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
                <StyledSpacer marginVertical={4} />
            </>
        )
    }

    return (
        <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
            <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
                <StyledHeader.Header onPress={() => navigator.navigate("bottom-tabs", { screen: 'Home' })} title='Articles' icon cycleProps={{
                    borderColor: theme.colors.gray[300],
                    marginRight: 8
                }}  />
            </StyledHeader>
            <YStack flex={1} paddingHorizontal={8}  backgroundColor={theme.colors.gray[100]}>
                <FlatList
                    data={VACCINES}                    
                    initialNumToRender={100}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.vaccine_id}
                    renderItem={({ item, index }) => {
                        return (
                            <ReaderCard navigator={navigator} reader={item} key={`${index}-${item.vaccine_id}`} />
                        )
                    }}
                />
            </YStack>                
        </StyledSafeAreaView>
    );
}

export default Articles