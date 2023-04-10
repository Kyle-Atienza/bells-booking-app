import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { SIZES } from "../../../constants";
import { checkInputLimit } from "../../../helpers/typeHelper";
import { globalStyles } from "../../../styles";
import { DataCard } from "../../cards";
import { DatePicker } from "./DatePicker";

export const InquiryAmount = ({
  formData,
  setFormData,
  amountData,
  newInquiry,
  inquiryType,
}) => {
  return (
    <>
      <View style={globalStyles.container}>
        <DataCard label="Sub Total" value={amountData.subTotal} />
        <View
          style={{ marginTop: SIZES.large }}
          pointerEvents={newInquiry ? "auto" : "none"}
        >
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
        {!formData.downpayment ? (
          <View
            style={{ marginTop: SIZES.large }}
            pointerEvents={newInquiry ? "auto" : "none"}
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
        ) : null}
        <View style={{ marginTop: SIZES.large }}>
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
        {!newInquiry &&
        inquiryType === "apartment" &&
        formData.downpayment &&
        parseFloat(amountData.balance) !== 0 ? (
          <View style={{ marginTop: SIZES.large }}>
            <Text variant="titleSmall">Payment</Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="0.00"
              value={formData.payment || ""}
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
