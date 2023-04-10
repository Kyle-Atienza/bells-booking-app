import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { SIZES } from "../../../constants";
import { globalStyles } from "../../../styles";
import { DataCard } from "../../cards";

export const InquiryAmount = ({
  formData,
  setFormData,
  amountData,
  newInquiry,
}) => {
  return (
    <>
      <View
        style={globalStyles.container}
        pointerEvents={newInquiry ? "auto" : "none"}
      >
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
                discount: text,
              }))
            }
            style={{ backgroundColor: "#fff" }}
            mode="outlined"
            dense
          />
        </View>
      </View>
      <View
        style={globalStyles.container}
        pointerEvents={newInquiry ? "auto" : "none"}
      >
        <DataCard label="Total Amount Due" value={amountData.totalAmountDue} />
        <View style={{ marginTop: SIZES.large }}>
          <Text variant="titleSmall">Downpayment</Text>
          <TextInput
            keyboardType="number-pad"
            placeholder="0.00"
            value={formData.downpayment || ""}
            onChangeText={(text) =>
              setFormData((prevState) => ({
                ...prevState,
                downpayment: text,
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
        {!newInquiry ? (
          <View style={{ marginTop: SIZES.large }}>
            <Text variant="titleSmall">Payment</Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="0.00"
              value={formData.payment || ""}
              onChangeText={(text) =>
                setFormData((prevState) => ({
                  ...prevState,
                  payment: text,
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
