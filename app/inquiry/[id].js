import { Stack, useRouter, useSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import { globalStyles } from "../../styles";
import { APARTMENT_PRICE, SIZES } from "../../constants";

import { InquiryInformation, InquiryAmount } from "../../components/inquiry";

import { createInquiry, getInquiries, payInquiry } from "../../services";

import { useInquiry } from "../../hooks";
import { UtilitiesContext } from "../../contexts";
import { capitalize } from "../../helpers/typeHelper";

const Inquire = () => {
  const theme = useTheme();
  const route = useRouter();

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
    downpaymentDue: null,
    payment: null,
  });
  const [amountData, setAmountData] = useState({
    subTotal: null,
    totalAmountDue: null,
    balance: null,
  });

  const {
    validateForm,
    mapDataFromDb,
    mapDataToDb,
    isLoading: isInquiryLoading,
  } = useInquiry();

  const onSubmit = () => {
    if (!validateForm(inquiryType, { formData, amountData })) {
      alert("Fill up all required forms");
      return;
    }

    setIsLoading(true);
    createInquiry(mapDataToDb(inquiryType, { formData, amountData }))
      .then((res) => {
        setIsLoading(false);
        setRefresh(true);
        route.push("/");
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };

  const onPayment = () => {
    if (formData.payment || (inquiryType === "event" && !formData.payment)) {
      setIsLoading(true);
      payInquiry({
        id: inquiryId,
        data: {
          type: "payment",
          amount:
            inquiryType === "apartment" ? formData.payment : amountData.balance,
        },
      })
        .then((res) => {
          console.log(res);
          setIsLoading(false);
          setRefresh(true);
        })
        .catch((e) => {
          console.log(e);
          setIsLoading(false);
        });
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
          const mappedResponse = mapDataFromDb(res.data.data.rows, inquiryId);

          setInquiryType(mappedResponse.inquiryType);
          setFormData(mappedResponse.formData);
          setAmountData((prevState) => ({
            ...prevState,
            balance: mappedResponse.balance,
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

  useEffect(() => {
    setIsLoading(isInquiryLoading);
  }, [isInquiryLoading]);

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
                {newInquiry
                  ? "Add Inquiry"
                  : `${capitalize(inquiryType || "")}`}
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
            inquiryType={inquiryType}
          />
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
              ) : (
                <TouchableOpacity onPress={() => onPayment()}>
                  <Button
                    style={globalStyles.button.primary(theme.colors.primary)}
                  >
                    <Text variant="labelLarge" style={{ color: "#fff" }}>
                      {inquiryType === "apartment" || amountData.balance !== 0
                        ? !formData.downpayment
                          ? "Pay Downpayment"
                          : "Pay Inquiry"
                        : "Mark as fully paid"}
                    </Text>
                  </Button>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Inquire;
