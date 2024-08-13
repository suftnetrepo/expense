/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React from 'react';
import { StyledImage, YStack, XStack, StyledBadge, StyledText } from 'fluent-styles';
import { theme, fontStyles } from '../../configs/theme';
import { useChildren } from '../../hooks/useChild';
import { FlatList } from 'react-native';
import { calculateVaccineCompletion, toWordCase } from '../../utils/help';
import { VaccineProgress } from './vaccineProgress';
import { useQueryCardByChild } from '../../hooks/useCard';

const VaccineCard = () => {
    const { data } = useChildren()

    const RenderCard = ({ item }) => {
        const { data = [] } = useQueryCardByChild(item.child_id)
        const { completedPercentage, completedCount, notCompletedCount } = calculateVaccineCompletion(data)
        return (
            <XStack paddingHorizontal={8} backgroundColor={theme.colors.gray[1]}
                paddingVertical={8} justifyContent='space-between' marginBottom={8} gap={8} borderRadius={16} alignItems='center' >
                <YStack flex={2}>
                    <XStack flex={1} alignItems='center' justifyContent='flex-start' >
                        <StyledImage
                            borderRadius={100}
                            borderWidth={5}
                            borderColor={theme.colors.gray[200]}
                            height={70}
                            width={70}
                            imageUrl={item.uri}
                        />
                        <YStack>
                            <StyledText paddingHorizontal={8} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.medium} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
                                {toWordCase(item.first_name)} {toWordCase(item.last_name)}
                            </StyledText>
                            <XStack>
                                <StyledBadge
                                    fontFamily={fontStyles.Roboto_Regular}
                                    color={theme.colors.green[900]}                                 
                                    backgroundColor={theme.colors.green[100]}
                                    fontWeight={theme.fontWeight.medium}
                                    fontSize={theme.fontSize.small}
                                    paddingHorizontal={5}
                                    paddingVertical={1}
                                >
                                    Done :{completedCount}
                                </StyledBadge>
                                <StyledBadge
                                    fontFamily={fontStyles.Roboto_Regular}
                                    color={theme.colors.pink[800]}
                                    backgroundColor={theme.colors.pink[100]}
                                    fontWeight={theme.fontWeight.medium}
                                    fontSize={theme.fontSize.small}
                                    paddingHorizontal={5}
                                    paddingVertical={1}
                                >
                                    Pending :{notCompletedCount}
                                </StyledBadge>
                            </XStack>
                        </YStack>
                    </XStack>
                </YStack>
                <XStack flex={1} justifyContent='flex-end' alignItems='center'>
                    <VaccineProgress completedPercentage={completedPercentage} />
                </XStack>
            </XStack>
        )
    }

    return (
        <YStack paddingHorizontal={4} >
            <FlatList
                data={data}
                initialNumToRender={100}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.child_id}
                renderItem={({ item, index }) => {
                    return (
                        <RenderCard item={item} key={`${index}-${item.child_id}`} />
                    )
                }}
            />
        </YStack>
    )
}

export default VaccineCard