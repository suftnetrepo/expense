/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { validate, StyledSpinner, YStack, StyledOkDialog, StyledImage, XStack, StyledHeader, StyledSafeAreaView, StyledSpacer, StyledText, StyledButton } from 'fluent-styles';
import RNFS from 'react-native-fs';
import { launchImageLibrary } from 'react-native-image-picker';
import { theme } from "../../configs/theme";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { childRules } from "./validatorRules";
import { StyledDropdown } from "../../components/dropdown";
import { useInsertChild } from "../../hooks/useChild";
import { ShowToast } from "../../components/toast";
import { Genotype } from "../../configs";
import { dateConverter } from "../../utils/help";
import { StyledMIcon } from "../../components/icon";
import { StyledInput } from "../../components/form";
import { resetStackInTab } from "../../components/helper";

const AddChild = () => {
  const navigator = useNavigation()
  const [errorMessages, setErrorMessages] = useState({})
  const [fields, setFields] = useState(childRules.fields)
  const [showPicker, setShowPicker] = useState(false);
  const { insert, error, loading, resetHandler } = useInsertChild()

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
      if (!response.didCancel || !response.errorCode) {
        const { uri } = response.assets[0];
        try {
          const newFilePath = `${RNFS.DocumentDirectoryPath}/${new Date().getTime()}.jpg`;
          await RNFS.copyFile(uri, newFilePath);      
          setFields({ ...fields, uri: uri })
        } catch (error) {
          if(__DEV__){
            console.error('Error moving image:', error);
          }       
        }
      }
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false)
    const currentDate = selectedDate || startDate;
    setFields({ ...fields, dateOfBirth: currentDate })
  };

  const onSubmit = async () => {
    setErrorMessages({})
    const { hasError, errors } = validate(fields, childRules.rules)
    if (hasError) {
      setErrorMessages(errors)
      return false
    }

    const handleResult = () => {
      ShowToast("Success", "Child was added successfully", "success")
      setFields(childRules.reset)
    }

    await insert({ ...fields, age: parseFloat(fields.age) }).then(async (result) => {
      result && handleResult()
    })
  }

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={() => resetStackInTab(navigator, 'bottom-tabs', 'Children')} title='Add Child' icon cycleProps={{
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
          <XStack justifyContent='center' alignItems='center' >
            <StyledImage
              borderRadius={100}
              borderWidth={5}
              borderColor={theme.colors.gray[100]}
              height={120}
              width={120}
              imageUrl={fields.uri}
            />
            <XStack absolute>
              <StyledMIcon right={40} bottom={-24} size={44} name='add-a-photo' color={theme.colors.gray[800]} onPress={() => handleSelectImage()} />
            </XStack>
          </XStack>
          <StyledInput
            label={'FirstName'}
            keyboardType='default'
            placeholder='Enter your firstname'
            returnKeyType='next'
            maxLength={50}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.first_name}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, first_name: text })}
            error={!!errorMessages?.first_name}
            errorMessage={errorMessages?.first_name?.message}
          />
          <StyledInput
            label={'LastName'}
            keyboardType='default'
            placeholder='Enter your lastname'
            returnKeyType='next'
            maxLength={50}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.last_name}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, last_name: text })}
            error={!!errorMessages?.last_name}
            errorMessage={errorMessages?.last_name?.message}
          />
          <StyledDropdown
            placeholder={'Select a Gender'}
            label={'Gender'}
            items={['Male', 'Female'].map((item) => ({ value: item, label: item }))}
            value={fields.gender}
            onSelectItem={e => setFields({ ...fields, gender: e.value })}
            error={!!errorMessages?.gender}
            errorMessage={errorMessages?.gender?.message}
            listMode='MODAL'
          />
          <StyledDropdown
            placeholder={'Select a Genotype'}
            label={'Genotype'}
            items={Genotype.map((item) => ({ value: item.value, label: item.label }))}
            value={fields.genotype}
            onSelectItem={e => setFields({ ...fields, genotype: e.value })}
            error={!!errorMessages?.genotype}
            errorMessage={errorMessages?.genotype?.message}
            listMode='MODAL'
          />          
          {showPicker && (
            <DateTimePicker
              value={fields.dateOfBirth}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <StyledInput
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8} value={dateConverter(fields.dateOfBirth.toISOString())}
            placeholderTextColor={theme.colors.gray[400]}
            error={!!errorMessages?.dateOfBirth}
            errorMessage={errorMessages?.dateOfBirth?.message} flex={1}
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

export default AddChild