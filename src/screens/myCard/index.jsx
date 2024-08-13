/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React from 'react';
import { YStack, XStack, StyledBadge, StyledHeader, StyledImage, StyledSafeAreaView, StyledSpacer, StyledText } from 'fluent-styles';
import { theme, fontStyles } from '../../configs/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native';
import { dateConverter, toWordCase, timeConverter } from '../../utils/help';
import { StyledStack } from '../../components/stack';

const MyCard = () => {
  const navigator = useNavigation()
  const route = useRoute()

  const { data } = route.params 
 
  const RenderCard = ({ item }) => {
    return (
      <StyledStack status={item.status === 1 ? '1' : '0'} paddingHorizontal={4} backgroundColor={theme.colors.gray[1]}
        paddingVertical={8} justifyContent='space-between' marginBottom={8} gap={8} borderRadius={16} alignItems='center'>       
        <YStack flex={2}>
          <StyledText paddingHorizontal={8} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
            {toWordCase(item.vaccine.name)}
          </StyledText>
          <StyledText paddingHorizontal={8} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.small} fontSize={theme.fontSize.small} color={theme.colors.gray[400]}>
            {toWordCase(item.provider)}
          </StyledText>
          <XStack paddingHorizontal={4}>
            <StyledBadge
              color={theme.colors.indigo[800]}
              backgroundColor={theme.colors.indigo[100]}
              fontWeight={theme.fontWeight.medium}
              fontSize={theme.fontSize.small}
              paddingHorizontal={10}
              paddingVertical={1}
            >
              {dateConverter(item.date)}
            </StyledBadge>
            <StyledSpacer marginHorizontal={2} />
            <StyledBadge
              color={theme.colors.pink[800]}
              backgroundColor={theme.colors.pink[100]}
              fontWeight={theme.fontWeight.medium}
              fontSize={theme.fontSize.small}
              paddingHorizontal={10}
              paddingVertical={1}
            >
              {timeConverter(item.time)}
            </StyledBadge>
          </XStack>
        </YStack>
        <YStack flex={1} alignItems='center' justifyContent='center'>
          <StyledImage
            borderRadius={100}
            borderWidth={5}
            borderColor={theme.colors.gray[100]}
            height={60}
            width={60}
            imageUrl={item.child.uri}
          />          
          <StyledBadge
            fontFamily={fontStyles.Roboto_Regular} 
            color={theme.colors.gray[800]}
            backgroundColor={theme.colors.gray[1]}
            fontWeight={theme.fontWeight.medium}
            fontSize={theme.fontSize.small}
            paddingHorizontal={10}
            paddingVertical={1}
          >
            {toWordCase(item.child.first_name)} {toWordCase(item.child.last_name)}
          </StyledBadge> 
        </YStack>
      </StyledStack>
    )
  }
 
  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header backgroundColor={theme.colors.gray[1]} onPress={() => navigator.navigate("bottom-tabs", { screen: 'Home' })} title='My Vaccine Appointments' icon cycleProps={{
          borderColor: theme.colors.gray[300],
          marginRight: 8
        }}  />
      </StyledHeader>
      <YStack flex={1} marginHorizontal={8} paddingVertical={8} backgroundColor={theme.colors.gray[100]}>
        <FlatList
          data={data}
          initialNumToRender={100}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.card_id}
          renderItem={({ item, index }) => {
            return (
              <RenderCard item={item} key={`${index}-${item.card_id}`} />
            )
          }}
        />
      </YStack>   
    </StyledSafeAreaView>
  );
}

export default MyCard