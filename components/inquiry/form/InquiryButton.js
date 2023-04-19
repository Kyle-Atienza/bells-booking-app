import React from "react";
import { globalStyles } from "../../../styles";
import { Button, Text, useTheme } from "react-native-paper";
import { TouchableOpacity, View } from "react-native";

export const InquiryButton = ({
  formData,
  amountData,
  newInquiry,
  hasDownpayment,
  onSubmit,
  onPayment,
}) => {
  const theme = useTheme();

  return (
    <>
      {parseFloat(amountData.balance) !== 0 ? (
        <View style={globalStyles.container}>
          {newInquiry ? (
            <TouchableOpacity onPress={() => onSubmit()}>
              <Button
                style={globalStyles.button.primary(theme.colors.secondary)}
              >
                <Text variant="labelLarge" style={{ color: "#fff" }}>
                  Add Inquiry
                </Text>
              </Button>
            </TouchableOpacity>
          ) : formData.downpayment || formData.payment ? (
            <TouchableOpacity
              onPress={() =>
                onPayment(
                  !hasDownpayment ? "downpayment" : "payment",
                  hasDownpayment
                    ? inquiryType === "apartment"
                      ? formData.payment
                      : amountData.balance
                    : formData.downpayment
                )
              }
            >
              <Button style={globalStyles.button.primary(theme.colors.primary)}>
                <Text variant="labelLarge" style={{ color: "#fff" }}>
                  {hasDownpayment
                    ? inquiryType === "apartment"
                      ? "Pay Apartment"
                      : "Mark as fully paid"
                    : "Pay Downpayment"}
                </Text>
              </Button>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </>
  );
};
