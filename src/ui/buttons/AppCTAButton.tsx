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
  verticalOffset?: number,

  title: string;
  fontSize?: number;
};

const animSpringConfig = {
  useNativeDriver: true,
  stiffness: 100,
  damping: 1,
  mass: 0.5,
  overshootClamping: true
}

export default ({
  variant = 'primary',
  vibration = 'light',
  verticalOffset = 2,

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
          position: 'relative',

          zIndex: 0,

          marginVertical: verticalOffset,
          marginHorizontal: StyleSheet.hairlineWidth,
          
          transform: [
            {
              translateY: animValue.interpolate(
                {
                  inputRange: [0, 1],
                  outputRange: [verticalOffset, 0]
                }
              )
            }
          ]
        },
        pressableProps.style as StyleProp<ViewStyle>
      ]}
    >
      <Animated.View
        style={[
          {

            zIndex: 1,

            borderRadius: 10,
    
            backgroundColor: 'white',
    
            paddingVertical: 5,
            paddingHorizontal: 10,

            transform: [
              {
                translateY: animValue.interpolate(
                  {
                    inputRange: [0, 1],
                    outputRange: [0, -verticalOffset]
                  }
                )
              }
            ]
          }
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
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    ...Platform.select({
      ios: {
        borderColor: PlatformColor('systemGreen'),
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: PlatformColor('systemGreen'),
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
        fontWeight: '900',
      }
    })
  }
});