import { Dimensions, StyleSheet } from "react-native";
import { SIZES } from "../constants";

export const globalStyles = StyleSheet.create({
  main: {
    paddingVertical: SIZES.large,
    minHeight: Dimensions.get("window").height,
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: "column",
    rowGap: 40,
  },
  container: {
    marginHorizontal: SIZES.large,
  },

  button: {
    primary: (color) => ({
      backgroundColor: color,
      borderRadius: 10,
      alignSelf: "center",
      paddingHorizontal: 20,
      paddingVertical: 5,
    }),
  },

  card: {
    data: {
      base: (style) => {},
    },
  },
});
