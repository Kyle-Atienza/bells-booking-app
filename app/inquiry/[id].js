import { Stack, useSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme, Text, TextInput, Button } from "react-native-paper";
import { globalStyles } from "../../styles";
import { APARTMENT_PRICE, SIZES } from "../../constants";

import { InquiryInformation, InquiryAmount } from "../../components/inquiry";

import { getInquiries, payInquiry } from "../../services";

import { useInquiry } from "../../hooks";
import { UtilitiesContext } from "../../contexts";

const Inquire = () => {
  const theme = useTheme();

  const { id: inquiryId } = useSearchParams();

  const { refresh, setRefresh } = useContext(UtilitiesContext);

  const [inquiryType, setInquiryType] = useState(undefined);
  const [newInquiry, setNewInquiry] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = React.useState({
    name: null,
    range: { startDate: null, endDate: null },
    date: null,
    schedule: null,
    estPax: null,
    apartmentCount: null,
    discount: null,
    downpayment: null,
    payment: null,
  });
  const [amountData, setAmountData] = useState({
    subTotal: null,
    totalAmountDue: null,
    balance: null,
  });

  const { validateForm, submitInquiry, payInquiry } = useInquiry(
    inquiryId,
    inquiryType,
    formData,
    amountData,
    setIsLoading
  );

  const onSubmit = () => {
    if (!validateForm()) {
      alert("Fill up all required forms");
      return;
    }

    submitInquiry();
  };

  const onPayment = () => {
    if (formData.payment) {
      payInquiry("payment");
    } else {
      alert("Please add amount of payment");
    }
  };

  useEffect(() => {
    setAmountData({
      subTotal: formData.apartmentCount * APARTMENT_PRICE,
      totalAmountDue:
        formData.apartmentCount * APARTMENT_PRICE - formData.discount,
      balance:
        formData.apartmentCount * APARTMENT_PRICE -
        formData.discount -
        formData.downpayment,
    });
  }, [formData.apartmentCount, formData.discount, formData.downpayment]);

  useEffect(() => {
    if (inquiryId === "apartment" || inquiryId === "event") {
      setInquiryType(inquiryId);
      setNewInquiry(true);
    } else {
      setNewInquiry(false);

      getInquiries()
        .then((res) => {
          let innerData = res.data.data.rows;
          const currentData = innerData.find(
            (item) => item.id === parseInt(inquiryId)
          );
          setInquiryType(currentData.type);

          setFormData({
            name: currentData.name,
            range: {
              startDate: new Date(currentData.apt_date_from),
              endDate: new Date(currentData.apt_date_to),
            },
            date: new Date(currentData.event_date),
            schedule: `${currentData.event_time_from} to ${currentData.event_time_to}`,
            estPax: null,
            discount: parseFloat(currentData.discount)
              ? parseFloat(currentData.discount).toString()
              : null,
            downpayment: parseFloat(currentData.downpayment)
              ? parseFloat(currentData.downpayment).toString()
              : null,
            apartmentCount: currentData.apt_addon || currentData.apt_qty,
          });

          setAmountData((prevState) => ({
            ...prevState,
            balance: currentData.balance,
          }));
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (refresh) setRefresh(false);

    () => {
      setInquiryType(undefined);
    };
  }, [refresh]);

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false,
          headerTitle: () => {
            return (
              <Text
                style={{ color: theme.colors.primary, fontWeight: 700 }}
                variant="titleLarge"
              >
                Add Inquiry
              </Text>
            );
          },
        }}
      />
      {isLoading ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#97979769",
            zIndex: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator
            style={{ marginTop: SIZES.large }}
            animating={isLoading}
            color={theme.colors.primary}
            size="large"
          />
        </View>
      ) : null}
      <ScrollView>
        <View style={globalStyles.main}>
          <InquiryInformation
            inquiryType={inquiryType}
            formData={formData}
            setFormData={setFormData}
            newInquiry={newInquiry}
          />
          <InquiryAmount
            formData={formData}
            setFormData={setFormData}
            amountData={amountData}
            newInquiry={newInquiry}
          />
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
            ) : (
              <TouchableOpacity onPress={() => onPayment()}>
                <Button
                  style={globalStyles.button.primary(theme.colors.primary)}
                >
                  <Text variant="labelLarge" style={{ color: "#fff" }}>
                    Pay Inquiry
                  </Text>
                </Button>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Inquire;
