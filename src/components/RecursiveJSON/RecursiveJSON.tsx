import React from "react";
import { View } from "react-native";
import AppText from "../../ui/texts/AppText";

export const RecursiveJSON = ({data, level = 0, ...props}: {data: Object, level?: number}) => {
  return(
    <View
      style={{
      }}
    >
      {
        Object.keys(data).map(
          (key, index) => {

            const value = Object.values(data)[index];

            if(typeof value !== 'object' && typeof value !== 'string') return;

            return(
              <View
                key={key}
                style={{
                }}
              >
                <AppText>
                  {key}
                </AppText>
                {
                  (
                    typeof value === 'object' &&
                    !Array.isArray(value) &&
                    value !== null
                  ) ?
                    <RecursiveJSON data={value} level={level+1} /> :
                  (
                    Array.isArray(value) &&
                    value != null
                  ) ?
                    value.map((arrVal, index) => <RecursiveJSON key={index} data={arrVal} level={level+1} />) :
                    <AppText
                      style={{
                      }}
                    >
                      {value}
                    </AppText>
                }
              </View>
            )
          }
        )
      }
    </View>
  )
}