/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState } from "react"
import { XStack, StyledButton, StyledText } from 'fluent-styles';
import { theme } from "../../configs/theme";

const StyledToggleSwitch = ({ defaultLabel = "D", onPress }) => {
    const [selected, setSelected] = useState(defaultLabel)

    const onSwitch = (label) => {
        setSelected(label)
       onPress && onPress(label)
    }
    return (
        <XStack justifyContent='space-between' borderRadius={35} paddingVertical={0} paddingHorizontal={0} borderColor={theme.colors.gray[300]} backgroundColor={theme.colors.gray[300]} alignItems='center'  >
            <StyledButton  borderRadius={35} selected={selected === defaultLabel} flex={1} onPress={() => { onSwitch(defaultLabel) }}>
                <StyledText paddingVertical={8} paddingHorizontal={16} color={theme.colors.gray[1]} selected={selected === defaultLabel}>{defaultLabel}</StyledText>
            </StyledButton>
            <StyledButton  borderRadius={35} selected={selected === "W"} flex={1} onPress={() => { onSwitch("W") }}>
                <StyledText paddingVertical={8} paddingHorizontal={16} color={theme.colors.gray[800]} selected={selected === "W"}>W</StyledText>
            </StyledButton>
            <StyledButton borderRadius={35} selected={selected === "M"} flex={1} onPress={() => { onSwitch("M") }}>
                <StyledText paddingVertical={8} paddingHorizontal={16} color={theme.colors.gray[800]} selected={selected === "M"}>M</StyledText>
            </StyledButton>
            <StyledButton borderRadius={35} selected={selected === "Y"} flex={1} onPress={() => { onSwitch("Y") }}>
                <StyledText paddingVertical={8} paddingHorizontal={16} color={theme.colors.gray[800]} selected={selected === "Y"}>Y</StyledText>
            </StyledButton>
        </XStack>
    )
}

export { StyledToggleSwitch }