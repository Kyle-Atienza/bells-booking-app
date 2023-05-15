import React from "react";
import { globalStyles } from "../../../styles";
import { Button, Text, useTheme } from "react-native-paper";
import { Alert, TouchableOpacity, View } from "react-native";
import { payInquiry, updateInquiry } from "../../../services";
import { DateTime } from "luxon";

export const InquiryButton = ({
  inquiryId,
  formData,
  amountData,
  newInquiry,
  pendingInquiry,
  hasDownpayment,
  onSubmit,
  onPayment,
  inquiryType,
  setRefresh,
  setIsLoading,
}) => {
  const theme = useTheme();

  const existingInquiryButton = () => {
    let action = null;
    let label = "";

    if (!newInquiry) {
      if (pendingInquiry) {
        if (formData.downpaymentDue) {
          action = () => {
            setIsLoading(true);
            updateInquiry({
              id: inquiryId,
              data: {
                downpayment_due: DateTime.fromISO(formData.downpaymentDue)
                  .toFormat("yyyy LL dd")
                  .replaceAll(" ", "-"),
              },
            })
              .then((res) => {
                setRefresh();
                setIsLoading(false);
              })
              .catch((e) => {
                console.log(e);

                setIsLoading(false);
              });
          };
          label = "Set Downpayment Due";
        } else if (formData.downpayment) {
          action = () => onPayment("payment", amountData.balance);
          label = "Pay Downpayment";
        }
      } else {
        if (!hasDownpayment) {
          action = () => onPayment("downpayment", formData.downpayment);
          label = "Pay Downpayment";
        } else {
          if (formData.payment) {
            if (formData.payment == amountData.balance) {
              action = () => onPayment("payment", amountData.balance);
              label = "Mark as fully paid";
            } else if (inquiryType === "apartment") {
              action = () => onPayment("payment", formData.payment);
              label = "Pay Apartment";
            }
          } else {
            if (!parseFloat(amountData.balance)) {
              action = () => {};
              label = "Fully Paid";
            } else if (inquiryType === "event") {
              action = () => onPayment("payment", amountData.balance);
              label = "Mark as fully paid";
            }
          }
        }
      }
    } else {
      if (formData.downpayment) {
        action = () => onPayment("downpayment", formData.downpayment);
        label = "Pay Downpayment";
      } else if (formData.downpaymentDue) {
        // update downpayment due
        action = () => {};
        label = "Schedule Downpayment";
      }
    }

    return label ? (
      <TouchableOpacity onPress={action}>
        <Button style={globalStyles.button.primary(theme.colors.primary)}>
          <Text variant="labelLarge" style={{ color: "#fff" }}>
            {label}
          </Text>
        </Button>
      </TouchableOpacity>
    ) : null;
  };

  return (
    <>
      <View style={globalStyles.container}>
        {newInquiry ? (
          <TouchableOpacity onPress={() => onSubmit()}>
            <Button style={globalStyles.button.primary(theme.colors.secondary)}>
              <Text variant="labelLarge" style={{ color: "#fff" }}>
                {parseFloat(amountData.balance) === 0 && !newInquiry
                  ? "Mark as fully paid"
                  : "Add Inquiry"}
              </Text>
            </Button>
          </TouchableOpacity>
        ) : (
          existingInquiryButton()
        )}
      </View>
    </>
  );
};
