/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState, useCallback } from 'react';
import {
  YStack, XStack, StyledConfirmDialog, StyledCycle, StyledHeader, StyledSafeAreaView,
  StyledSpinner, StyledOkDialog, StyledSpacer, StyledText
} from 'fluent-styles';
import { theme, fontStyles } from '../../../configs/theme';
import { StyledMIcon } from '../../../components/icon';
import { useNavigation } from '@react-navigation/native';
import { useCategories, useDeleteCategory, useUpdateCategory } from '../../../hooks/useCategory';
import { FlatList } from 'react-native';
import { toWordCase } from '../../../utils/help';
import { StyledStack } from '../../../components/stack';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

const RenderCard = React.memo(({ item, onDelete, onUpdateStatus, onEdit }) => {
  return (
    <Swipeable renderRightActions={() => (
      <XStack justifyContent='flex-end' alignItems='center' paddingHorizontal={8}>
        <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
          <StyledMIcon size={32} name='delete-outline' color={theme.colors.gray[800]} onPress={onDelete} />
        </StyledCycle>
      </XStack>
    )}>
      <StyledStack status={item.status === 1 ? '1' : '0'} paddingHorizontal={8} backgroundColor={theme.colors.gray[1]}
        paddingVertical={8} justifyContent='flex-start' marginBottom={8} borderRadius={16} alignItems='center'>
        <YStack flex={2}>
          <StyledText paddingHorizontal={8} fontFamily={fontStyles.FontAwesome5_Regular} fontWeight={theme.fontWeight.medium} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
            {toWordCase(item.name)}
          </StyledText>
        </YStack>
        <XStack flex={1} justifyContent='flex-end' alignItems='center'>
          <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon size={24} name='edit' color={theme.colors.gray[600]} onPress={onEdit} />
          </StyledCycle>
          <StyledSpacer marginHorizontal={4} />
          <StyledCycle borderWidth={1} borderColor={item.status === 1 ? theme.colors.green[100] : theme.colors.gray[400]} backgroundColor={item.status === 1 ? theme.colors.green[100] : theme.colors.gray[1]}>
            <StyledMIcon size={32} name={item.status === 1 ? 'done' : 'close'} color={theme.colors.gray[600]} onPress={onUpdateStatus} />
          </StyledCycle>
        </XStack>
      </StyledStack>
    </Swipeable>
  );
});

const Category = () => {
  const navigator = useNavigation();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [category, setCategory] = useState();
  const [page, setPage] = useState(1);
  const { data, error, loading, loadHandler, resetHandler, hasMore } = useCategories(page);
  const { deleteCategory, error: deleteError } = useDeleteCategory();
  const { updateSingleCategoryHandler } = useUpdateCategory();

  const onConfirm = useCallback(() => {
    deleteCategory(category?.category_id).then(async (result) => {
      if (result) {
        loadHandler(page);
      }
      setIsDialogVisible(false);
    });
  }, [category, deleteCategory, loadHandler]);

  const onDelete = (item) => {
    setIsDialogVisible(true);
    setCategory(item);
  };

  const onEdit = (item) => {
    navigator.navigate("edit-category", { category: item });
  };

  const onUpdateStatus = (item) => {
    updateSingleCategoryHandler(item.category_id, (item.status === 1 ? 0 : 1)).then((result) => {
      if (result) {
        loadHandler(1);
      }
    });
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }}>
        <StyledHeader.Header
          onPress={() => navigator.navigate("bottom-tabs", { screen: 'Settings' })}
          title='Categories'
          icon
          cycleProps={{
            borderColor: theme.colors.gray[300],
            marginRight: 8,
          }}
          rightIcon={
            <XStack flex={1} justifyContent='flex-end' alignItems='center' paddingHorizontal={16}>
              <StyledCycle borderWidth={1} borderColor={theme.colors.cyan[400]} backgroundColor={theme.colors.cyan[500]}>
                <StyledMIcon size={24} name='add' color={theme.colors.gray[1]} onPress={() => navigator.navigate("add-category")} />
              </StyledCycle>            
            </XStack>
          }
        />
      </StyledHeader>
      <YStack flex={1} paddingHorizontal={8} paddingVertical={8} backgroundColor={theme.colors.gray[100]}>
        <GestureHandlerRootView>
          <FlatList
            data={data}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.category_id}-${index}`} 
            renderItem={({ item }) => (
              <RenderCard
                item={item}
                onDelete={() => onDelete(item)}
                onEdit={() => onEdit(item)}
                onUpdateStatus={() => onUpdateStatus(item)}
              />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={loading && <StyledSpinner />}
          />
        </GestureHandlerRootView>
      </YStack>
      {(error || deleteError) && (
        <StyledOkDialog
          title={error?.message || deleteError?.message}
          description='Please try again'
          visible={true}
          onOk={resetHandler}
        />
      )}
      {loading && <StyledSpinner />}
      {isDialogVisible && (
        <StyledConfirmDialog
          visible
          description='Are you sure you want to delete this category?'
          confirm='Yes'
          cancel='No'
          title='Confirmation'
          onCancel={() => setIsDialogVisible(false)}
          onConfirm={onConfirm}
        />
      )}
    </StyledSafeAreaView>
  );
};

export default Category;
