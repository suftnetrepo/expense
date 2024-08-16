/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect } from "react";
import { validate, StyledSpinner, YStack, XStack, StyledOkDialog, StyledCycle, StyledHeader, StyledSafeAreaView, StyledSpacer, StyledText, StyledButton } from 'fluent-styles';
import { fontStyles, theme } from "../../configs/theme";
import { useNavigation, CommonActions } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { expenseRules } from "./validatorRules";
import { ShowToast } from "../../components/toast";
import { dateConverter } from "../../utils/help";
import { StyledMIcon } from "../../components/icon";
import { StyledInput } from "../../components/form";
import { useInsertExpense } from "../../hooks/useExpense";
import { useQueryCategoriesByStatus } from "../../hooks/useCategory";
import { ScrollView } from "react-native";

const RenderButton = ({ category, fields, index, handleSelectItem, theme }) => {

  useEffect(() => {
    if (category.category_id !== 1 && fields.category_id === category.category_id) {
      handleSelectItem(index);
    }
  }, [category.category_id, fields.category_id, index, handleSelectItem]);

  return (
    <XStack paddingHorizontal={16} justifyContent="flex-start" alignItems="center">
      {(category.category_id !== 1 && fields.category_id === category.category_id) && (
        <>
          <StyledCycle borderWidth={1} height={24} width={24} borderColor={theme.colors.gray[1]} backgroundColor={theme.colors.gray[1]}>
            <StyledMIcon size={16} name='done' color={theme.colors.gray[700]} />
          </StyledCycle>
          <StyledSpacer marginHorizontal={4} />
        </>
      )}
     
      <StyledText
        fontFamily={fontStyles.Roboto_Regular}
        fontSize={theme.fontSize.small}
        color={theme.colors.gray[1]}
        paddingVertical={8}
      >
        {category.name}
      </StyledText>
    </XStack>
  );
};

export const RenderCategories = ({ from, expense, navigator, categories, setFields, fields, errorMessages }) => {
  const scrollViewRef = useRef(null);

  const handleSelectItem = (index) => {
    const itemWidth = 100; 
    const scrollToX = index * itemWidth;

    scrollViewRef.current.scrollTo({ x: scrollToX, animated: true });
  };

  return (
    <>
      <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false}>
        <XStack paddingHorizontal={8} paddingVertical={6} >
          {
            ([{ category_id: 1, name: "Add Category", color_code: theme.colors.warmGray[600] }, ...categories] || []).map((category, index) => (
              <XStack key={index}>
                <StyledButton borderRadius={32} borderColor={category.color_code || theme.colors.gray[600]} backgroundColor={category.color_code || theme.colors.gray[600]} onPress={() => {
                  if (category.category_id === 1) {
                    navigator.navigate("categories", {
                      from,
                      expense
                    })
                  } else {
                    setFields({ ...fields, category_id: category.category_id })
                  }
                }}>
                  <RenderButton category={category} fields={fields} index={index} handleSelectItem={handleSelectItem} theme={theme} />
                </StyledButton>
                <StyledSpacer marginHorizontal={4} />
              </XStack>
            ))
          }
        </XStack>
      </ScrollView>
      {
        errorMessages?.category_id && (
          <>
            <StyledText marginHorizontal={8} fontWeight={theme.fontWeight.bold} fontSize={theme.fontSize.small} color={theme.colors.pink[500]} >
              {errorMessages?.category_id?.message}
            </StyledText>
          </>
        )
      }
    </>
  )
}

const AddExpense = () => {
  const navigator = useNavigation()
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(expenseRules.fields)
  const [showPicker, setShowPicker] = useState(false);
  const { data: categories } = useQueryCategoriesByStatus()
  const { insertHandler, error, loading, resetHandler } = useInsertExpense()

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

    const handleResult = () => {
      ShowToast("Success", "Expense was added successfully", "success")
      setFields(expenseRules.reset)
    }

    await insertHandler({ ...fields, amount: parseFloat(fields.amount) }).then(async (result) => {
      result && handleResult()
    })
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={() => navigator.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'bottom-tabs', state: { routes: [{ name: 'Expense' }] } }],
          })
        )} title='Add Expense' icon cycleProps={{
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
          <StyledSpacer paddingVertical={4} />
          <RenderCategories navigator={navigator} expense="expense" from='add-expense' categories={categories} setFields={setFields} fields={fields} errorMessages={errorMessages} />
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
            value={fields.amount}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, amount: parseFloat(text) })}
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

export default AddExpense