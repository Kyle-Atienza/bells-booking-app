import React from "react";
import { globalStyles } from "../../../styles";
import { Button, Text, useTheme } from "react-native-paper";
import { TouchableOpacity, View } from "react-native";
import { updateInquiry } from "../../../services";
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
        action = () => {
          if (formData.downpaymentDue) {
            setIsLoading(true);
            updateInquiry({
              id: inquiryId,
              data: {
                downpayment_due: DateTime.fromISO(
                  formData.downpaymentDue.toISOString()
                )
                  .toFormat("yyyy LL dd")
                  .replaceAll(" ", "-"),
              },
            })
              .then((res) => {
                console.log(res);
                setRefresh();
                setIsLoading(false);
              })
              .catch((e) => {
                console.log(e);
                setIsLoading(false);
              });
          } else {
            alert("Please add downpayment due date");
          }
        };
        label = "Set Downpayment Due";
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

  // console.log("pendingInquiry", pendingInquiry, formData.downpaymentDue);

  return (
    <>
      <View style={globalStyles.container}>
        {newInquiry ? (
          <TouchableOpacity onPress={() => onSubmit()}>
            <Button style={globalStyles.button.primary(theme.colors.secondary)}>
              <Text variant="labelLarge" style={{ color: "#fff" }}>
                {parseFloat(amountData.balance) === 0
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

{
  /* {newInquiry ? (
            <TouchableOpacity onPress={() => onSubmit()}>
              <Button
                style={globalStyles.button.primary(theme.colors.secondary)}
              >
                <Text variant="labelLarge" style={{ color: "#fff" }}>
                  Add Inquiry
                </Text>
              </Button>
            </TouchableOpacity>
          ) : formData.downpayment ||
            formData.payment ||
            formData.downpaymentDue ? (
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
          ) : null} */
}
