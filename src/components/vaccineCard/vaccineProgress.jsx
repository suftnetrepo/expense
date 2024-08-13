/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
/* eslint-disable prettier/prettier */
import React from 'react';
import { theme } from '../../configs/theme';
import CircularProgress from 'react-native-circular-progress-indicator';

const VaccineProgress = ({ completedPercentage })=> {
   
    return (
        <CircularProgress
            value={completedPercentage}
            radius={30}         
            activeStrokeColor={theme.colors.lime[200]}
            inActiveStrokeColor={theme.colors.pink[700]}
            inActiveStrokeOpacity={0.5}
            inActiveStrokeWidth={10}
            activeStrokeWidth={10}
            valueSuffix={'%'}
            titleColor={theme.colors.gray[400]}
            progressValueColor={theme.colors.gray[600]}
            progressValueFontSize={theme.fontSize.small}
        />
    )
}

export { VaccineProgress }