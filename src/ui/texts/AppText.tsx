import React from 'react';
import { Platform, StyleSheet, Text, TextProps } from 'react-native';


export type AppTextProps = {

};
export default class AppText extends React.Component<TextProps & AppTextProps> {
  render() {
    const { ...textProps} = this.props;
    return(
      <Text
        { ...textProps }
        style={[
          styles.text,
          textProps.style
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  text: {
    ...Platform.select({
      ios: {
        fontFamily: 'Helvetica Neue',
        textAlign: 'center',
        color: 'white'
      }
    })
  },
});