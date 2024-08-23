/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { YStack, XStack, StyledConfirmDialog, StyledCycle, StyledHeader, StyledSafeAreaView, StyledSpinner, StyledOkDialog, StyledSpacer, StyledText } from 'fluent-styles';
import { theme, fontStyles } from '../../../configs/theme';
import { StyledMIcon } from '../../../components/icon';
import { useNavigation } from '@react-navigation/native';
import { useUsers, useDeleteUser } from '../../../hooks/useUser';
import { FlatList } from 'react-native';
import { toWordCase } from '../../../utils/help';
import { useAppContext } from '../../../hooks/appContext';
import { StyledStack } from '../../../components/stack';

const User = () => {
  const navigator = useNavigation()
  const { user } = useAppContext()
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [currentUser, setCurrentUser] = useState()
  const { data, error, loading, loadUsers, resetHandler } = useUsers()
  const { deleteUser, error: deleteError, loading: deleting } = useDeleteUser()

  const onConfirm = () => {
    deleteUser(currentUser?.user_id).then(async (result) => {
      result && (
        loadUsers()
      )
      setIsDialogVisible(false)
    })
  }

  const onDelete = (item) => {
    if (user.user_id !== item.user_id) {
      setIsDialogVisible(true)
      setCurrentUser(item)
    }
  }

  const RenderCard = ({ item }) => {
    const status = (user.user_id === item.user_id) ? '1': '0'   
    return (
      <StyledStack status={status} paddingHorizontal={8} backgroundColor={theme.colors.gray[1]}
        paddingVertical={8} justifyContent='flex-start' marginBottom={8} borderRadius={16} alignItems='center'>
        <YStack flex={2}>
          <StyledText paddingHorizontal={8} fontFamily={fontStyles.FontAwesome5_Regular} fontWeight={theme.fontWeight.medium} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
            {toWordCase(item.first_name)} {toWordCase(item.last_name)}
          </StyledText>
          <StyledText paddingHorizontal={8} fontFamily={fontStyles.FontAwesome5_Regular} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.small} color={theme.colors.gray[600]}>
            {status == 1 ? "online" : "offline"}
          </StyledText>
        </YStack>
        <XStack flex={1} justifyContent='flex-end' alignItems='center'>
          <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon size={24} name='edit' color={theme.colors.gray[600]} onPress={() => navigator.navigate("edit-user", {
              user: item
            })} />
          </StyledCycle>
          <StyledSpacer marginHorizontal={4} />
          <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon size={32} name='delete-outline' color={theme.colors.gray[600]} onPress={() => onDelete(item)} />
          </StyledCycle>
        </XStack>
      </StyledStack>
    )
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={() => navigator.navigate("bottom-tabs", { screen: 'Settings' })} title='Users' icon cycleProps={{
          borderColor: theme.colors.gray[300],
          marginRight: 8
        }} rightIcon={
          <XStack flex={1} justifyContent='flex-end' alignItems='center' paddingHorizontal={16}>
            <StyledCycle borderWidth={1} borderColor={theme.colors.cyan[400]} backgroundColor={theme.colors.cyan[500]}>
              <StyledMIcon size={24} name='add' color={theme.colors.gray[1]} onPress={() => navigator.navigate("add-user")} />
            </StyledCycle>
          </XStack>
        } />
      </StyledHeader>
      <YStack flex={1} paddingHorizontal={8} paddingVertical={8} backgroundColor={theme.colors.gray[100]}>
        <FlatList
          data={data}
          initialNumToRender={100}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.user_id}
          renderItem={({ item, index }) => {
            return (
              <RenderCard item={item} key={index} />
            )
          }}
        />
      </YStack>
      {
        (error || deleteError) && (
          <StyledOkDialog title={error?.message || deleteError?.message} description='please try again' visible={true} onOk={() => {
            resetHandler()
          }} />
        )
      }
      {
        (loading || deleting) && (
          <StyledSpinner />
        )
      }
      {isDialogVisible &&
        <StyledConfirmDialog
          visible
          description='Are you sure you want to delete this user?'
          confirm='Yes'
          cancel='No'
          title={'Confirmation'}
          onCancel={() => setIsDialogVisible(false)}
          onConfirm={() => onConfirm()}
        />}
    </StyledSafeAreaView>
  );
}

export default User