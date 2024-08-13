/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { validate, StyledSpinner, XStack, YStack, StyledCheckBox, StyledBadge, StyledCard, StyledCycle, StyledDialog, StyledOkDialog, StyledHeader, StyledSafeAreaView, StyledSpacer, StyledText, StyledButton } from 'fluent-styles';
import { fontStyles, theme } from "../../configs/theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { cardRules } from "./validatorRules";
import { useUpdateCard } from "../../hooks/useCard";
import { dateConverter } from "../../utils/help";
import { StyledMIcon } from "../../components/icon";
import { StyledInput } from "../../components/form";
import { queryVaccineById } from "../../model/vaccine";
import { useVaccines } from "../../hooks/useVaccine";
import { ScrollView } from "react-native";
import { StyledDropdown } from "../../components/dropdown";
import { Reminders } from "../../configs";

const EditCard = () => {
  const navigator = useNavigation()
  const route = useRoute()
  const [errorMessages, setErrorMessages] = useState({})
  const [modalVisible, setModalVisible] = useState(false)
  const [fields, setFields] = useState(cardRules.fields)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { update, error, loading, resetHandler } = useUpdateCard()
  const { data } = useVaccines()
  const { child, card } = route.params

  useEffect(() => {
    setFields((pre) => {
      return {
        ...pre,
        ...card,
        date: new Date(card?.date),
        time: new Date(card?.time),
      }
    })
  }, [card])

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false)
    const currentTime = selectedTime || time;
    setFields({ ...fields, time: currentTime })
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    const currentDate = selectedDate || startDate;
    setFields({ ...fields, date: currentDate })
  };

  const onSubmit = async () => {
    setErrorMessages({})
    const { hasError, errors } = validate(fields, cardRules.rules)
    if (hasError) {
      setErrorMessages(errors)
      return false
    }

    await update({ ...fields }).then(async (result) => {
      result && navigator.reset({
        key: "cards",
        index: 0,
        routes: [{ name: 'cards', params: { child: child } }]
      })
    })
  } 

  const RenderCard = ({ item }) => {
    return (
      <StyledCard pressable pressableProps={{
        onPress: () => {
          setModalVisible(false)
          setFields({ ...fields, vaccine_id: item.vaccine_id })
        }
      }}>
        <XStack flex={1} marginVertical={4} paddingHorizontal={8} paddingVertical={8} justifyContent='space-between' alignItems='center' borderWidth={1} borderColor={theme.colors.gray[400]} borderRadius={16}>
          <YStack paddingHorizontal={8} justifyContent='flex-start' alignItems='flex-start'>
            <StyledText fontFamily={fontStyles.Roboto_Bold} color={theme.colors.gray[800]} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal}>
              {item.name}
            </StyledText>
            <StyledText fontFamily={fontStyles.Roboto_Regular} color={theme.colors.gray[600]} fontSize={theme.fontSize.normal} fontWeight={theme.fontWeight.normal}>
              {item.description}
            </StyledText>
            <StyledBadge
              color={theme.colors.orange[800]}
              fontWeight={theme.fontWeight.medium}
              fontSize={theme.fontSize.medium}
              paddingVertical={1}
            >
              {item.dosage}
            </StyledBadge>
          </YStack>
        </XStack>
      </StyledCard>

    )
  }
  const RenderVaccines = () => (
    <YStack paddingHorizontal={8} justifyContent='flex-start' alignItems='flex-start'>
      <XStack width={'100%'} justifyContent='flex-start' alignItems='center'>
        <StyledCycle borderWidth={1} borderColor={theme.colors.gray[400]}>
          <StyledMIcon size={30} name='arrow-back' color={theme.colors.gray[700]} onPress={() => setModalVisible(false)} />
        </StyledCycle>
      </XStack>
      <StyledSpacer marginVertical={4} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {
          (data || []).map((item, index) => {
            return (
              <RenderCard key={index} item={item} />
            )
          })
        }
      </ScrollView>
    </YStack>
  )

  return (
    <StyledSafeAreaView backgroundColor={theme.colors.gray[1]}>
      <StyledHeader marginHorizontal={8} statusProps={{ translucent: true }} >
        <StyledHeader.Header onPress={() => navigator.reset({
          key: "cards",
          index: 0,
          routes: [{ name: 'cards', params: { child: child } }]
        })} title='Edit Card' icon cycleProps={{
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
          <StyledInput
            label={'Vaccine'}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            returnKeyType='next'
            maxLength={50}
            paddingHorizontal={8} value={queryVaccineById(fields.vaccine_id)?.name || ""}
            placeholderTextColor={theme.colors.gray[400]}
            error={!!errorMessages?.vaccine_id}
            errorMessage={errorMessages?.vaccine_id?.message} flex={1}
            icon={
              <StyledCycle marginHorizontal={5} borderWidth={1} borderColor={theme.colors.gray[400]}>
                <StyledMIcon size={30} name='search' color={theme.colors.gray[800]} onPress={() => { setModalVisible(true) }} />
              </StyledCycle>
            }
          />
          {showDatePicker && (
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
            returnKeyType='next'
            paddingHorizontal={8}
            maxLength={50}
            value={dateConverter(fields.date.toISOString())}
            placeholderTextColor={theme.colors.gray[400]}
            error={!!errorMessages?.date}
            errorMessage={errorMessages?.date?.message} flex={1}
            icon={
              < StyledMIcon size={44} name='date-range' color={theme.colors.gray[800]} onPress={() => { setShowDatePicker(true) }} />
            }
          />
          {showTimePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={fields.time}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}
          <StyledInput
            label={'Time'}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            returnKeyType='next'
            maxLength={50}
            paddingHorizontal={8} value={fields.time.toLocaleTimeString()}
            placeholderTextColor={theme.colors.gray[400]}
            error={!!errorMessages?.time}
            errorMessage={errorMessages?.time?.message} flex={1}
            icon={
              < StyledMIcon size={44} name='access-time' color={theme.colors.gray[800]} onPress={() => { setShowTimePicker(true) }} />
            }
          />
          <StyledInput
            label={'Provider'}
            keyboardType='default'
            placeholder='Enter your provider'
            returnKeyType='done'
            maxLength={100}
            fontSize={theme.fontSize.small}
            borderColor={theme.colors.yellow[800]}
            backgroundColor={theme.colors.gray[1]}
            borderRadius={32}
            paddingHorizontal={8}
            value={fields.provider}
            placeholderTextColor={theme.colors.gray[400]}
            onChangeText={(text) => setFields({ ...fields, provider: text })}
            error={!!errorMessages?.provider}
            errorMessage={errorMessages?.provider?.message}
          />
          <StyledDropdown
            placeholder={'Select a Reminder'}
            label={'Reminder'}
            items={Reminders.map((item) => ({ value: item.value, label: item.label }))}
            value={fields.reminder}
            onSelectItem={e => setFields({ ...fields, reminder: e.value })}
            listMode='MODAL'
          />
          <XStack
            justifyContent='flex-start'
            alignItems='center'
            paddingVertical={8}
            paddingHorizontal={16}
          >
            <StyledSpacer marginVertical={8} />
            <StyledCheckBox
              height={30}
              width={30}
              checked={fields.status === 1 ? true : false}
              checkedColor={theme.colors.pink[600]}
              onPress={(value) => setFields({ ...fields, status: value ? 1 : 0 })}
            />
            <StyledSpacer marginHorizontal={8} />
            <StyledText
              fontWeight={theme.fontWeight.normal}
              color={theme.colors.gray[600]}
              fontSize={theme.fontSize.normal}
            >
              Done
            </StyledText>

          </XStack>   
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
      {modalVisible &&
        <StyledDialog visible transparent={false}>
          <RenderVaccines />
        </StyledDialog>}
    </StyledSafeAreaView>
  )
}

export default EditCard