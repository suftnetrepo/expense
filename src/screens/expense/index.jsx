/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React, { useState, useCallback, useEffect } from 'react';
import { YStack, XStack, StyledConfirmDialog, StyledButton, StyledInput, StyledCycle, StyledBadge, StyledHeader, StyledSafeAreaView, StyledSpinner, StyledOkDialog, StyledSpacer, StyledText } from 'fluent-styles';
import { theme, fontStyles } from '../../configs/theme';
import { StyledMIcon } from '../../components/icon';
import { CommonActions, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FlatList } from 'react-native';
import { dateConverter, formatCurrency, toWordCase } from '../../utils/help';
import { useDeleteExpense, useAllExpenses } from '../../hooks/useExpense';
import { StyledStack } from '../../components/stack';
import { DownloadExpense } from './downloadPayment';
import { useAppContext } from '../../hooks/appContext';

const RenderCard = React.memo(({ item, onDelete, onEdit, currency }) => {
  
  return (
    <StyledStack borderLeftColor={item?.category?.color_code || theme.colors.gray[300]} paddingHorizontal={8} backgroundColor={theme.colors.gray[1]}
        paddingVertical={8} justifyContent='space-between' marginBottom={8} gap={8} borderRadius={16} alignItems='center'>
        <YStack flex={2}>
          <XStack alignItems='center' justifyContent='flex-start'>
            <YStack flex={1}>
              <StyledText paddingHorizontal={5} fontFamily={fontStyles.Roboto_Regular} fontWeight={theme.fontWeight.normal} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]}>
                {toWordCase(item?.category?.name)}
              </StyledText>
              <XStack flex={1}>
                <XStack alignItems='center' justifyContent='flex-start'>
                  <StyledMIcon size={16} name='date-range' color={theme.colors.gray[600]} />
                  <StyledBadge
                    color={theme.colors.indigo[800]}
                    backgroundColor={theme.colors.indigo[50]}
                    fontWeight={theme.fontWeight.normal}
                    fontSize={theme.fontSize.small}
                    paddingVertical={1}
                    paddingHorizontal={5}
                  >
                    {dateConverter(item.date.toISOString())}
                  </StyledBadge>
                  <StyledBadge
                    color={theme.colors.green[800]}
                    backgroundColor={theme.colors.green[100]}
                    fontWeight={theme.fontWeight.medium}
                    fontSize={theme.fontSize.normal}
                    paddingVertical={1}
                    paddingHorizontal={10}
                  >
                    {formatCurrency(currency || "£", item.amount)}
                  </StyledBadge>
                </XStack>
              </XStack>
            </YStack>
          </XStack>
        </YStack>
        <XStack flex={1} justifyContent='flex-end' alignItems='center'>
           <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon size={24} name='edit' color={theme.colors.gray[600]} onPress={onEdit} />
          </StyledCycle>
           <StyledSpacer marginHorizontal={4} />
          <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
            <StyledMIcon size={32} name='delete-outline' color={theme.colors.gray[800]} onPress={onDelete} />
          </StyledCycle>         
        </XStack>
      </StyledStack>
  );
});

const Expense = () => {
  const navigator = useNavigation();
  const { user } = useAppContext()
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [expense, setExpense] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const { data, error, loading, loadHandler, resetHandler, loadExpensesByDateRange, deleteRefresh } = useAllExpenses();
  const { deleteHandler, error: deleteError } = useDeleteExpense();

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    setStartDate(currentDate)
  }, [])

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(false);
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(false);
    setEndDate(currentDate);
  };

  const handleFilter = async () => {
    setShowFilter(!showFilter)
    showFilter && await loadHandler()
  }

  const onConfirm = useCallback(() => {
    deleteHandler(expense?.expense_id).then(async (result) => {
      if (result) {
        deleteRefresh(expense?.expense_id)
      }
      setIsDialogVisible(false);
    });
  }, [deleteHandler, expense, loadHandler]);

  const onDelete = (item) => {
    setIsDialogVisible(true);
    setExpense(item);
  };

  const onEdit = (item) => {
    navigator.navigate("edit-expense", {
      expense: {
        ...item,
        date: item?.date?.toISOString()
      }
    });
  };

  const RenderDatePicker = () => {
    return (
      <YStack marginHorizontal={8}>
        <XStack paddingHorizontal={4} borderRadius={16} justifyContent='flex-start' alignItems='center' backgroundColor={theme.colors.gray[200]}>
          <XStack flex={1} justifyContent='flex-start' alignItems='center'>
            <StyledInput fontSize={theme.fontSize.micro}
              borderColor={theme.colors.yellow[800]}
              backgroundColor={theme.colors.gray[1]} borderRadius={8} value={dateConverter(startDate.toISOString())} flex={1} />
            <StyledMIcon size={44} name='date-range' color={theme.colors.gray[800]} onPress={() => { setShowStartPicker(true) }} />
          </XStack>
          <StyledSpacer marginHorizontal={1} />
          <XStack flex={1} justifyContent='flex-start' alignItems='center'>
            <StyledInput fontSize={theme.fontSize.micro}
              borderColor={theme.colors.yellow[800]}
              backgroundColor={theme.colors.gray[1]} borderRadius={8} value={dateConverter(endDate.toISOString())} flex={1} />
            <StyledMIcon size={44} name='date-range' color={theme.colors.gray[800]} onPress={() => { setShowEndPicker(true) }} />
          </XStack>
          <StyledSpacer marginHorizontal={1} />
          <StyledButton backgroundColor={theme.colors.cyan[500]} onPress={() => loadExpensesByDateRange(startDate, endDate)} >
            <StyledText color={theme.colors.gray[1]} fontWeight={theme.fontWeight.normal}
              fontSize={theme.fontSize.normal}
              paddingHorizontal={16}
              paddingVertical={16}
              fontFamily={fontStyles.FontAwesome5_Regular}>
              Go
            </StyledText>
          </StyledButton>
          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </XStack>
        <StyledSpacer marginVertical={4} />
        <DownloadExpense data={data} currency={user.currency} />
      </YStack>
    )
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={() => navigator.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'bottom-tabs', state: { routes: [{ name: 'Home' }] } }],
          })
        )
        } title='Expenses' icon cycleProps={{
          borderColor: theme.colors.gray[300],
          marginRight: 8
        }} rightIcon={
          <XStack flex={1} justifyContent='flex-end' alignItems='center' paddingHorizontal={16}>
            <StyledCycle borderWidth={1} borderColor={theme.colors.cyan[400]} backgroundColor={theme.colors.cyan[500]}>
              <StyledMIcon size={24} name='add' color={theme.colors.gray[1]} onPress={() => navigator.navigate("add-expense")} />
            </StyledCycle>
            <StyledSpacer marginHorizontal={2} />
            <StyledSpacer marginHorizontal={4} />
            <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]} >
              <StyledMIcon size={32} name={showFilter ? "cancel" : 'filter-list'} color={theme.colors.gray[800]} onPress={() => handleFilter()} />
            </StyledCycle>
            <StyledSpacer marginHorizontal={4} />
          </XStack>
        } />
      </StyledHeader>
      {
        showFilter && (
          <>
            <StyledSpacer marginVertical={4} />
            <RenderDatePicker />
          </>
        )
      }

      <YStack flex={1} paddingHorizontal={8} paddingVertical={8} backgroundColor={theme.colors.gray[100]}>
       <FlatList
            data={data}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.expense_id}-${index}`}
            renderItem={({ item }) => (
              <RenderCard
                currency = {user.currency}
                item={item}
                onDelete={() => onDelete(item)}
                onEdit={() => onEdit(item)}
              />
            )}
            extraData={data.length}
          />
      </YStack>
      {(error || deleteError) && (
        <StyledOkDialog title={error?.message || deleteError?.message} description='Please try again' visible={true} onOk={resetHandler} />
      )}
      {loading && (
        <StyledSpinner />
      )}
      {isDialogVisible && (
        <StyledConfirmDialog
          visible
          description='Are you sure you want to delete this expense?'
          confirm='Yes'
          cancel='No'
          title='Confirmation'
          onCancel={() => setIsDialogVisible(false)}
          onConfirm={onConfirm}
        />
      )}
    </StyledSafeAreaView>
  );
}

export default Expense;
