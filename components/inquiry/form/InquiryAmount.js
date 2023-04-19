import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { SIZES } from "../../../constants";
import { checkInputFloor, checkInputLimit } from "../../../helpers/typeHelper";
import { globalStyles } from "../../../styles";
import { DataCard } from "../../cards";
import { DatePicker } from "./DatePicker";

export const InquiryAmount = ({
  formData,
  setFormData,
  amountData,
  newInquiry,
  inquiryType,
  hasDownpayment,
}) => {
  const isPayable =
    !newInquiry &&
    inquiryType === "apartment" &&
    parseFloat(formData.downpayment) &&
    parseFloat(amountData.balance) !== 0 &&
    hasDownpayment;

  return (
    <>
      <View style={globalStyles.container}>
        <DataCard label="Sub Total" value={amountData.subTotal} />
        <View style={{ marginTop: SIZES.large }}>
          <Text variant="titleSmall">Discount (in PHP)</Text>
          <TextInput
            keyboardType="number-pad"
            placeholder="0.00"
            value={formData.discount || ""}
            onChangeText={(text) =>
              setFormData((prevState) => ({
                ...prevState,
                discount: checkInputLimit(text, amountData.subTotal).toString(),
              }))
            }
            style={{ backgroundColor: "#fff" }}
            mode="outlined"
            dense
          />
        </View>
      </View>
      <View style={globalStyles.container}>
        <DataCard label="Total Amount Due" value={amountData.totalAmountDue} />
        <View
          style={{
            marginTop: SIZES.large,
          }}
        >
          <Text variant="titleSmall">Downpayment Due</Text>
          <DatePicker
            date={formData.downpaymentDue}
            setDate={(date) =>
              setFormData((prevState) => ({
                ...prevState,
                downpaymentDue: date,
              }))
            }
          />
        </View>
        <View
          style={{
            marginTop: SIZES.large,
          }}
        >
          <Text variant="titleSmall">Downpayment</Text>
          <TextInput
            keyboardType="number-pad"
            placeholder="0.00"
            value={formData.downpayment || ""}
            onChangeText={(text) =>
              setFormData((prevState) => ({
                ...prevState,
                downpayment: checkInputLimit(
                  text,
                  amountData.totalAmountDue
                ).toString(),
              }))
            }
            style={{ backgroundColor: "#fff" }}
            mode="outlined"
            dense
          />
        </View>
      </View>
      <View style={globalStyles.container}>
        <DataCard label="Balance" value={amountData.balance} />
        {isPayable ? (
          <View style={{ marginTop: SIZES.large }}>
            <Text variant="titleSmall">Payment</Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="0.00"
              value={
                formData.payment
                  ? checkInputLimit(
                      formData.payment,
                      formData.balance
                    ).toString()
                  : ""
              }
              onChangeText={(text) =>
                setFormData((prevState) => ({
                  ...prevState,
                  payment: checkInputLimit(text, amountData.balance).toString(),
                }))
              }
              style={{ backgroundColor: "#fff" }}
              mode="outlined"
              dense
            />
          </View>
        ) : null}
      </View>
    </>
  );
};
