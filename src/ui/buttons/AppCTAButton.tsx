import React, { useEffect, useRef, useState } from 'react';
import { Pressable, PressableProps, Platform, StyleSheet, Text, PlatformColor, Animated, ViewStyle, StyleProp, View } from 'react-native';
import AppText from '../texts/AppText';

import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type AppCTAButtonVariants =
  | 'primary';

  
type AppCTAButtonVibrations =
| 'none'
| 'light'
| 'medium'
| 'heavy';

export type AppCTAButtonProps = {
  variant?: AppCTAButtonVariants
  vibration?: AppCTAButtonVibrations

  title: string;
  fontSize?: number;
};

const animSpringConfig = {
  useNativeDriver: true,
  stiffness: 10,
  damping: 1,
  mass: 0.5,
  overshootClamping: true
}

export default ({
  variant = 'primary',
  vibration = 'light',

  title,
  fontSize,
  ...pressableProps
}: Omit<PressableProps, 'children'> & AppCTAButtonProps) => {
  
  /** Local Refs */

  // animScale will be used as the value for scale. Initial Value: 1
  const animValue = useRef(new Animated.Value(1)).current;

  /** Local States & Their 'Effects' */
  const [pressed, setPressed] = useState<boolean>(false);
  useEffect(() => {
    if(pressed) {
      Animated.spring(
        animValue,
        {
          toValue: 0,
          ...animSpringConfig
        }
      ).start();
    } else {
      Animated.spring(
        animValue,
        {
          toValue: 1,
          ...animSpringConfig
        }
      ).start();
    }
  }, [pressed])
  
  return(
    <AnimatedPressable
      { ...pressableProps }
      onPressIn={
        (event) => {
          setPressed(true);

          let impact;

          switch(vibration) {
            case 'none':
              break;
            case 'light':
              impact = Haptics.ImpactFeedbackStyle.Light;
              break;
            case 'medium':
              impact = Haptics.ImpactFeedbackStyle.Medium;
              break;
            case 'heavy':
              impact = Haptics.ImpactFeedbackStyle.Heavy;
              break;            
          }
          
          if(impact) Haptics.impactAsync(impact);

          pressableProps.onPressIn?.(event);
        }
      }

      onPressOut={
        (event) => {
          setPressed(false);
          pressableProps.onPressOut?.(event);
        }
      }

      style={[
        styles.pressable,
        {
          opacity: Animated.add(animValue, 0.75),
          transform: [{scale: Animated.diffClamp(animValue, 0.98, 1)}] 
        },
        pressableProps.style as StyleProp<ViewStyle>
      ]}
    >
      <AppText
        style={[
          styles.ctaText,
          fontSize && {
            fontSize: fontSize
          }
        ]}
      >
        {title}
      </AppText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    ...Platform.select({
      ios: {
        borderRadius: 100,
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 20
      }
    })
  },

  ctaView: {
    ...Platform.select({
      ios: {
      }
    })
  },

  ctaText: {
    ...Platform.select({
      ios: {
        color: PlatformColor('systemGreen'),

        textAlign: 'center',
        fontWeight: 'normal',
      }
    })
  }
});