/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { YStack, XStack, StyledSafeAreaView, StyledBackgroundImage, StyledText, StyledHeader, StyledSpacer } from 'fluent-styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { fontStyles, theme } from '../../configs/theme';
import { PCV13, HepB, DTaP, BImm, Hib, HepA, Flu, IPV, MMR, RV, Varicella } from '../../../assets/data';

const ArticleDetails = () => {
    const navigator = useNavigation()
    const route = useRoute()
    const [article, setArticle] = useState()
    const { reader } = route.params

    useEffect(() => {
        switch (reader.vaccine_id) {
            case "HepA":
                setArticle(HepA)
                break;
            case "HepB":
                setArticle(HepB)
                break;
            case "BImm":
                setArticle(BImm)
                break;
            case "DTaP":
                setArticle(DTaP)
                break;
            case "Hib":
                setArticle(Hib)
                break;
            case "PCV13":
                setArticle(PCV13)
                break;
            case "Flu":
                setArticle(Flu)
                break;
            case "IPV":
                setArticle(IPV)
                break;
            case "MMR":
                setArticle(MMR)
                break;
            case "RV":
                setArticle(RV)
                break;
            case "Varicella":
                setArticle(Varicella)
                break;
            default:
                setArticle(BImm)
        }
    }, [reader.vaccine_id])
   
    const RenderBold = ({ part }) => {
        const cleanedText = part.replace(/-|\*\*|/g, '').trim();
        return (
            <StyledText fontFamily={fontStyles.Roboto_Bold}
                fontSize={theme.fontSize.normal}
                color={theme.colors.gray[800]}  > {cleanedText}</StyledText>
        )
    }

    const formatText = (content) => {
        return content.map((text, index) => {
            const boldPattern = /(-[^:]*:)/g;
            if (boldPattern.test(text.trim())) {
                const parts = text?.split(boldPattern)            
                return (
                    <StyledText key={index} fontFamily={fontStyles.Roboto_Regular}
                        fontSize={theme.fontSize.normal}
                        color={theme.colors.gray[800]}  ><RenderBold part={parts[1]} />{parts[2]}</StyledText>
                );
            }

            return (
                <StyledText key={index}>
                    {text}{' '}
                </StyledText>
            );
        });
    };


    return (
        <StyledSafeAreaView backgroundColor={theme.colors.gray[100]}>
            <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
                <StyledHeader.Header backgroundColor={theme.colors.gray[1]} onPress={() => navigator.navigate("bottom-tabs", { screen: 'Articles' })} title={reader?.name} icon cycleProps={{
                    borderColor: theme.colors.gray[300],
                    marginRight: 8
                }} rightIcon={
                    <XStack flex={1} justifyContent='flex-end' alignItems='center' paddingHorizontal={8}>

                    </XStack>
                } />
            </StyledHeader>
            <YStack flex={1} paddingHorizontal={8} backgroundColor={theme.colors.gray[100]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <StyledBackgroundImage
                        local
                        flex={1}
                        borderRadius={8}
                        height={200}
                        source={reader?.uri}
                    >
                        <YStack flex={1} justifyContent='center' alignItems='center' backgroundColor={theme.colors.transparent05}>
                            <StyledText
                                fontFamily={fontStyles.Roboto_Bold}
                                fontSize={theme.fontSize.xlarge}
                                color={theme.colors.gray[1]}
                                paddingHorizontal={16}
                                paddingVertical={16}
                            >
                                {article?.title}
                            </StyledText>
                        </YStack>
                    </StyledBackgroundImage>
                    <StyledSpacer marginVertical={8} />
                    {article?.sections?.map((section, index) => (
                        <YStack paddingVertical={8}
                            key={index}
                            paddingHorizontal={8}>
                            <StyledText
                                fontFamily={fontStyles.Roboto_Bold}
                                fontSize={theme.fontSize.xlarge}
                                color={theme.colors.gray[800]}>
                                {section.title}
                            </StyledText>
                            <StyledSpacer marginVertical={8} />
                            {formatText(section.content)}
                            {/* {section.content.map((paragraph, pIndex) => (
                                <StyledText
                                    key={pIndex}
                                    fontFamily={fontStyles.Roboto_Regular}
                                    fontSize={theme.fontSize.normal}
                                    color={theme.colors.gray[800]}                               
                                    paddingVertical={2}>
                                    {formatText(paragraph)}
                                </StyledText>
                            ))} */}
                        </YStack>
                    ))}
                </ScrollView>
            </YStack>
        </StyledSafeAreaView>
    );
}

export default ArticleDetails;
