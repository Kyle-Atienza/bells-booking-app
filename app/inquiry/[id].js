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
import { LoadingScreen } from "../../components/common";

const Inquire = () => {
  const theme = useTheme();
  const route = useRouter();

  const { id: inquiryId } = useSearchParams();

  const { refresh, setRefresh } = useContext(UtilitiesContext);

  const [inquiryType, setInquiryType] = useState(undefined);
  const [newInquiry, setNewInquiry] = useState(undefined);
  const [hasDownpayment, setHasDownpayment] = useState(false);
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

  const onPayment = (type, amount) => {
    console.log({
      id: inquiryId,
      data: {
        type: type,
        amount: amount,
      },
    });
    if (
      formData.payment ||
      (inquiryType === "event" && !formData.payment) ||
      (!hasDownpayment && formData.downpayment)
    ) {
      setIsLoading(true);
      payInquiry({
        id: inquiryId,
        data: {
          type: type,
          amount: parseFloat(amount),
        },
      })
        .then((res) => {
          setIsLoading(false);
          setRefresh(true);
        })
        .catch((e) => {
          console.log("payment", e);
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
          console.log(inquiryId);
          setAmountData((prevState) => ({
            ...prevState,
            balance: mappedResponse.balance,
          }));
          setHasDownpayment(!!mappedResponse.formData.downpayment);
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
      {isLoading ? <LoadingScreen /> : null}
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
            hasDownpayment={hasDownpayment}
          />
          {parseFloat(amountData.balance) !== 0 ? (
            <View style={globalStyles.container}>
              {newInquiry ? (
                parseFloat(formData.downpayment) || formData.downpaymentDue ? (
                  <TouchableOpacity onPress={() => onSubmit()}>
                    <Button
                      style={globalStyles.button.primary(
                        theme.colors.secondary
                      )}
                    >
                      <Text variant="labelLarge" style={{ color: "#fff" }}>
                        Add Inquiry
                      </Text>
                    </Button>
                  </TouchableOpacity>
                ) : null
              ) : (
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
                  <Button
                    style={globalStyles.button.primary(theme.colors.primary)}
                  >
                    <Text variant="labelLarge" style={{ color: "#fff" }}>
                      {hasDownpayment
                        ? inquiryType === "apartment"
                          ? "Pay Apartment"
                          : "Mark as fully paid"
                        : "Pay Downpayment"}
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
