import React from 'react';
import { Pressable, PressableProps, Platform, StyleSheet } from 'react-native';


export type AppPressableProps = {
};
export default class AppPressable extends React.Component<PressableProps & AppPressableProps> {
  render() {
    const { ...pressableProps} = this.props;
    return(
      <Pressable
        { ...pressableProps }
        style={[
          styles.pressable,
          pressableProps.style
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  pressable: {
    ...Platform.select({
      ios: {
      }
    })
  },
});