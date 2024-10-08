/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { validate, StyledSpinner, YStack, StyledOkDialog, StyledHeader, StyledSafeAreaView, StyledSpacer, StyledText, StyledButton } from 'fluent-styles';
import { theme } from "../../configs/theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from '@react-native-community/datetimepicker';
import { expenseRules } from "./validatorRules";
import { dateConverter } from "../../utils/help";
import { StyledMIcon } from "../../components/icon";
import { StyledInput } from "../../components/form";
import { useQueryCategoriesByStatus } from "../../hooks/useCategory";
import { useUpdateExpense } from "../../hooks/useExpense";
import { RenderCategories } from "./add";

const EditExpense = () => {
  const navigator = useNavigation()
  const route = useRoute()
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(expenseRules.fields)
  const [showPicker, setShowPicker] = useState(false);
  const { updateHandler, error, loading, resetHandler } = useUpdateExpense()
  const { data: categories } = useQueryCategoriesByStatus()
  const { expense } = route.params

  useEffect(() => {
    setFields((pre) => {
      return {
        ...pre,
        ...expense,
        date: new Date(expense?.date)
      }
    })
  }, [expense])

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false)
    const currentDate = selectedDate || startDate;
    setFields({ ...fields, date: currentDate })
  };

  const onSubmit = async () => {
    setErrorMessages({})
    const { hasError, errors } = validate(fields, expenseRules.rules)
    if (hasError) {
      setErrorMessages(errors)
      return false
    }

    await updateHandler({ ...fields, amount: parseFloat(fields.amount) }).then(async (result) => {
      result && backHandler()
    })
  }

   const backHandler = () => {
    if (navigator.canGoBack()) {
      navigator.goBack()
    } else {
       navigator.navigate("bottom-tabs", { screen: 'Expense' })
    }
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={() => { backHandler() }} title='Edit Expense' icon cycleProps={{
          borderColor: theme.colors.gray[300],
          marginRight: 8
        }} />
      </StyledHeader>

      <YStack
        flex={1}
        backgroundColor={theme.colors.gray[100]}
        paddingHorizontal={16}
      >
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <StyledSpacer paddingVertical={8} />
          <RenderCategories navigator={navigator} expense={expense} from='edit-expense' categories={categories} setFields={setFields} fields={fields} errorMessages={errorMessages} />
          <StyledInput
            label={'Amount'}
            keyboardType='decimal-pad'
            placeholder='Enter amount'
            returnKeyType='next'
            maxLength={9}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.amount.toString()}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, amount: text })}
            error={!!errorMessages?.amount}
            errorMessage={errorMessages?.amount?.message}
          />

          {showPicker && (
            <DateTimePicker
              value={fields.date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <StyledInput
            label={'Date'}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8} value={dateConverter(fields.date.toISOString())}
            placeholderTextColor={theme.colors.gray[400]}
            error={!!errorMessages?.date}
            errorMessage={errorMessages?.date?.message} flex={1}
            icon={
              < StyledMIcon size={44} name='date-range' color={theme.colors.gray[800]} onPress={() => { setShowPicker(true) }} />
            }
          />
          <StyledSpacer marginVertical={8} />
          <StyledButton width='100%' backgroundColor={theme.colors.cyan[500]} onPress={() => onSubmit()} >
            <StyledText paddingHorizontal={20} paddingVertical={10} color={theme.colors.gray[1]}>
              Save Changes
            </StyledText>
          </StyledButton>
          <StyledSpacer marginVertical={4} />
        </KeyboardAwareScrollView>
      </YStack>
      {
        (error) && (
          <StyledOkDialog title={error?.message} description='please try again' visible={true} onOk={() => {
            resetHandler()
          }} />
        )
      }
      {
        (loading) && (
          <StyledSpinner />
        )
      }
    </StyledSafeAreaView>
  )
}

export default EditExpense