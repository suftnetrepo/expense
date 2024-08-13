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
import { useNavigation } from '@react-navigation/native';
import { useChildren, useDeleteChild } from '../../hooks/useChild';
import { FlatList } from 'react-native';
import { dateConverter, toWordCase } from '../../utils/help';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

const Children = () => {
  const navigator = useNavigation()
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [child, setChild] = useState()
  const { data, error, loading, loadChildren, resetHandler } = useChildren()
  const { deleteChild, error: deleteError } = useDeleteChild()

  const onConfirm = () => {
    deleteChild(child?.child_id).then(async (result) => {
      result && (
        loadChildren()
      )
      setIsDialogVisible(false)
    })
  }

  const renderRightActions = (item) => (
    <XStack justifyContent='flex-end' alignItems='center' paddingHorizontal={8} >
      <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
        <StyledMIcon size={32} name='delete-outline' color={theme.colors.gray[800]} onPress={() => {
          setIsDialogVisible(true)
          setChild(item)
        }} />
      </StyledCycle>
    </XStack>
  );

  const RenderCard = ({ item }) => {
    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <XStack paddingHorizontal={8} backgroundColor={theme.colors.gray[1]}
          paddingVertical={8} justifyContent='space-between' marginBottom={8} gap={8} borderRadius={16} alignItems='center' >
          <YStack flex={2}>
            <XStack alignItems='center' justifyContent='flex-start' >
              <StyledImage
                borderRadius={100}
                borderWidth={5}
                borderColor={theme.colors.gray[100]}
                height={60}
                width={60}
                imageUrl={item.uri}
              />
              <YStack flex={1}>
                <StyledText paddingHorizontal={5} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
                  {toWordCase(item.first_name)} {toWordCase(item.last_name)}
                </StyledText>
                <XStack>
                  <StyledBadge
                    color={theme.colors.indigo[800]}
                    backgroundColor={theme.colors.indigo[100]}
                    fontWeight={theme.fontWeight.medium}
                    fontSize={theme.fontSize.micro}
                    paddingHorizontal={5}
                    paddingVertical={1}
                  >
                    {item.gender}
                  </StyledBadge>
                  <StyledSpacer marginHorizontal={2} />
                  <StyledBadge
                    color={theme.colors.green[800]}
                    backgroundColor={theme.colors.green[100]}
                    fontWeight={theme.fontWeight.medium}
                    fontSize={theme.fontSize.micro}
                    paddingHorizontal={5}
                    paddingVertical={1}
                  >
                    {item.genotype}
                  </StyledBadge>
                  <StyledBadge
                    color={theme.colors.pink[800]}
                    backgroundColor={theme.colors.pink[100]}
                    fontWeight={theme.fontWeight.medium}
                    fontSize={theme.fontSize.micro}
                    paddingHorizontal={5}
                    paddingVertical={1}
                  >
                    {dateConverter(item.dateOfBirth.toISOString())}
                  </StyledBadge>
                </XStack>
              </YStack>
            </XStack>
          </YStack>
      
          <XStack flex={1} justifyContent='flex-end' alignItems='center'>
            <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
              <StyledMIcon size={24} name='edit' color={theme.colors.gray[600]} onPress={() => navigator.navigate("edit-child", {
                child: {
                  ...item,
                  dateOfBirth: item?.dateOfBirth?.toISOString()
                }
              })} />
            </StyledCycle>
            <StyledSpacer marginHorizontal={4} />
            <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
              <StyledMIcon size={32} name='book' color={theme.colors.gray[800]} onPress={() => navigator.navigate("cards", {
                child: {
                  ...item,
                  dateOfBirth: item?.dateOfBirth?.toISOString()
                }
              })} />
            </StyledCycle>
          </XStack>
        </XStack>
      </Swipeable>
    )
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={() => navigator.navigate("bottom-tabs", { screen: 'Home' })} title='Children' icon cycleProps={{
          borderColor: theme.colors.gray[300],
          marginRight: 8
        }} rightIcon={
          <XStack flex={1} justifyContent='flex-end' alignItems='center' paddingHorizontal={16}>
            <StyledCycle borderWidth={1} borderColor={theme.colors.cyan[400]} backgroundColor={theme.colors.cyan[500]}>
              <StyledMIcon size={24} name='add' color={theme.colors.gray[1]} onPress={() => navigator.navigate("add-child")} />
            </StyledCycle>
          </XStack>
        } />
      </StyledHeader>
      <YStack flex={1} paddingHorizontal={8} paddingVertical={8} backgroundColor={theme.colors.gray[100]}>
        <GestureHandlerRootView>
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
        </GestureHandlerRootView>
      </YStack>
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
          description='Are you sure you want to delete this child?'
          confirm='Yes'
          cancel='No'
          title={'Confirmation'}
          onCancel={() => setIsDialogVisible(false)}
          onConfirm={() => onConfirm()}
        />}
    </StyledSafeAreaView>
  );
}

export default Children