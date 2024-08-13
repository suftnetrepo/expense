/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { StyledImage, YStack, XStack, StyledConfirmDialog, StyledCycle, StyledBadge, StyledHeader, StyledSafeAreaView, StyledSpinner, StyledOkDialog, StyledSpacer, StyledText } from 'fluent-styles';
import { theme, fontStyles } from '../../configs/theme';
import { StyledMIcon } from '../../components/icon';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDeleteCard, useQueryCardByChild } from '../../hooks/useCard';
import { FlatList } from 'react-native';
import { dateConverter, toWordCase, timeConverter } from '../../utils/help';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyledStack } from '../../components/stack';

const Card = () => {
  const navigator = useNavigation()
  const route = useRoute()
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [card, setCard] = useState() 
  const { deleteCard, error: deleteError } = useDeleteCard()
  const { child } = route.params
  const { data, error, loading, loadCards, resetHandler } = useQueryCardByChild(child?.child_id)

  const onConfirm = () => {
    deleteCard(card?.card_id).then(async (result) => {
      result && (
        loadCards(child?.child_id)
      )
      setIsDialogVisible(false)
    })
  }

  const renderRightActions = (item) => (
    <XStack justifyContent='flex-end' alignItems='center' paddingHorizontal={8} >
      <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
        <StyledMIcon size={32} name='delete-outline' color={theme.colors.gray[800]} onPress={() => {
          setIsDialogVisible(true)
          setCard(item)
        }} />
      </StyledCycle>
    </XStack>
  );

  const RenderCard = ({ item }) => {
    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <StyledStack status={item.status === 1 ? '1' : '0'} paddingHorizontal={4} backgroundColor={theme.colors.gray[1]}
          paddingVertical={8} justifyContent='space-between' marginBottom={8} gap={8} borderRadius={16} alignItems='center' >
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
        
          <XStack flex={1} justifyContent='flex-end' alignItems='center'>
            <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
              <StyledMIcon size={24} name='edit' color={theme.colors.gray[600]} onPress={() => navigator.navigate("edit-card", {
                card: {
                  ...item,  
                  date: item.date.toISOString(),
                  time: item.time.toISOString(),
                  child :{
                    ...item.child,
                    dateOfBirth: item?.child?.dateOfBirth?.toISOString()
                  }                               
                },
                child
              })} />
            </StyledCycle>
          </XStack>
        </StyledStack>
      </Swipeable>
    )
  }

  const RenderHeader = () => {
    return (
      <XStack flex={1} justifyContent='flex-start' alignItems='center' paddingVertical={8} paddingHorizontal={16}>
        <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
          <StyledMIcon size={30} name='arrow-back' color={theme.colors.gray[700]} onPress={() => navigator.navigate("bottom-tabs", { screen: 'Children' })} />
        </StyledCycle>
        <StyledSpacer marginHorizontal={4} />
        <XStack alignItems='center' justifyContent='flex-start' >
          <StyledImage
            borderRadius={100}
            borderWidth={5}
            borderColor={theme.colors.gray[100]}
            height={50}
            width={50}
            imageUrl={child.uri}
          />
          <YStack>
            <StyledText paddingHorizontal={3} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
              {toWordCase(child.first_name)} {toWordCase(child.last_name)}
            </StyledText>
            <XStack>
              <StyledBadge
                color={theme.colors.gray[400]}
                backgroundColor={theme.colors.gray[1]}
                fontWeight={theme.fontWeight.medium}
                fontSize={theme.fontSize.medium}
                paddingHorizontal={5}
                paddingVertical={1}
              >
                {child.gender}
              </StyledBadge>
              <StyledSpacer marginHorizontal={2} />
            </XStack>
          </YStack>
        </XStack>
        <StyledSpacer flex={1} />
        <StyledCycle borderWidth={1} borderColor={theme.colors.cyan[400]} backgroundColor={theme.colors.cyan[500]}>
          <StyledMIcon size={24} name='add' color={theme.colors.gray[1]} onPress={() => navigator.navigate("add-card", {
            child
          })} />
        </StyledCycle>
      </XStack>
    )
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader statusProps={{ translucent: true }} >
        <StyledHeader.Full>
          <RenderHeader />
        </StyledHeader.Full>
      </StyledHeader>
      <GestureHandlerRootView flex={1} marginHorizontal={8} paddingVertical={8} backgroundColor={theme.colors.gray[100]}>
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
      </GestureHandlerRootView>
      {
        (error || deleteError) && (
          <StyledOkDialog title={error?.message || deleteError?.message} description='please try again' visible={true} onOk={() => {
            resetHandler()
          }} />
        )
      }
      {
        (loading) && (
          <StyledSpinner />
        )
      }
      {isDialogVisible &&
        <StyledConfirmDialog
          visible
          description='Are you sure you want to delete this card?'
          confirm='Yes'
          cancel='No'
          title={'Confirmation'}
          onCancel={() => setIsDialogVisible(false)}
          onConfirm={() => onConfirm()}
        />}
    </StyledSafeAreaView>
  );
}

export default Card