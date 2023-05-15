import { Stack, useRouter, useSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { useTheme, Text, IconButton, Button } from "react-native-paper";
import { globalStyles } from "../../styles";

import {
  InquiryInformation,
  InquiryAmount,
  InquiryButton,
} from "../../components/inquiry";

import {
  createInquiry,
  getInquiries,
  payInquiry,
  updateInquiry,
} from "../../services";

import { useInquiry } from "../../hooks";
import { UtilitiesContext } from "../../contexts";
import { capitalize } from "../../helpers/typeHelper";
import {
  validateForm,
  mapDataFromDb,
  mapDataToDb,
  compute,
} from "../../helpers/inqiuryHelper";
import { LoadingScreen } from "../../components/common";
import { DateTime } from "luxon";
import { SIZES } from "../../constants";

const Inquire = () => {
  const theme = useTheme();
  const router = useRouter();

  const { id: inquiryId } = useSearchParams();

  const { refresh, setRefresh, configurations, isLoading, setIsLoading } =
    useContext(UtilitiesContext);

  const { resetData } = useInquiry();

  const [inquiryType, setInquiryType] = useState(undefined);
  const [newInquiry, setNewInquiry] = useState(undefined);
  const [pendingInquiry, setPendingInquiry] = useState(undefined);
  const [hasDownpayment, setHasDownpayment] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: null,
    number: null,
    range: { startDate: null, endDate: null },
    date: null,
    schedule: null,
    estPax: null,
    apartmentCount: null,
    discount: null,
    downpayment: null,
    downpaymentDue: null,
    payment: null,
    withCatering: null,
    eventType: null,
  });
  const [amountData, setAmountData] = useState({
    subTotal: null,
    totalAmountDue: null,
    balance: null,
  });
  const [priceData, setPriceData] = useState({});

  const onSubmit = () => {
    if (!validateForm(inquiryType, { formData, amountData })) {
      alert("Fill up all required forms");
      return;
    }

    setIsLoading(true);
    createInquiry(mapDataToDb(inquiryType, { formData, amountData, priceData }))
      .then((res) => {
        setIsLoading(false);

        Alert.alert("Inquiry Created", "Inquiry successfully created", [
          {
            text: "OK",
            onPress: () => {
              setFormData({
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
                withCatering: null,
                eventType: null,
              });
              setAmountData({
                subTotal: null,
                totalAmountDue: null,
                balance: null,
              });
              setPriceData({});
              router.push("/");
              setRefresh(true);
            },
            style: "default",
          },
        ]);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
        if (e.response.status === 409) {
          alert(e.response.data.message);
        }
      });
  };

  const onPayment = (type, amount) => {
    if (parseFloat(amount)) {
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
          Alert.alert(
            "Transaction Successful",
            `${type.slice(0, 1).toUpperCase() + type.slice(1)} Successful`,
            [
              {
                text: "OK",
                onPress: () => {
                  setRefresh(true);
                },
                style: "default",
              },
            ]
          );
        })
        .catch((e) => {
          setIsLoading(false);
        });
    } else {
      if (type === "downpayment") {
        Alert.alert(
          "Empty Value",
          "Please add Downpayment amount",
          [
            {
              text: "OK",
            },
          ],
          {
            cancelable: true,
          }
        );
      } else if (type === "payment") {
        Alert.alert(
          "Empty Value",
          "Please add Payment amount",
          [
            {
              text: "OK",
            },
          ],
          {
            cancelable: true,
          }
        );
      }
    }
  };

  useEffect(() => {
    setAmountData(
      compute(newInquiry, inquiryType, priceData, formData, amountData)
    );
  }, [formData, refresh, priceData]);

  useEffect(() => {
    if (inquiryId === "apartment" || inquiryId === "event") {
      setFormData({
        name: null,
        number: null,
        range: { startDate: null, endDate: null },
        date: null,
        schedule: null,
        estPax: null,
        apartmentCount: null,
        discount: null,
        downpayment: null,
        downpaymentDue: null,
        payment: null,
        withCatering: null,
        eventType: null,
      });
      setAmountData({
        subTotal: null,
        totalAmountDue: null,
        balance: null,
      });
      setPriceData({});

      setInquiryType(inquiryId);
      setNewInquiry(true);
      setPriceData(configurations);
      setRefresh(false);
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
          setPriceData(mappedResponse.prices);
          setHasDownpayment(!!mappedResponse.formData.downpayment);
          setPendingInquiry(
            !mappedResponse.formData.downpaymentDue &&
              !mappedResponse.formData.downpayment
          );
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
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setRefresh(true);
      }
    );

    return () => backHandler.remove();
  }, []);

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
          headerRight: () => {
            if (!newInquiry) {
              return (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#B00020",
                    borderRadius: 10,
                    marginRight: SIZES.large,
                  }}
                  onPress={() => {
                    Alert.alert(
                      "Cancel Inquiry",
                      "Are you sure you want to cancel this inquiry?",
                      [
                        {
                          text: "OK",
                          onPress: () => {
                            setIsLoading(true);
                            updateInquiry({
                              id: inquiryId,
                              data: {
                                status: "cancelled",
                              },
                            })
                              .then((res) => {
                                router.push(-1);
                                setIsLoading(false);
                                setRefresh(true);
                              })
                              .catch((e) => {
                                console.log(e);
                                setIsLoading(false);
                              });
                          },
                          style: "default",
                        },
                        {
                          text: "Cancel",
                        },
                      ],
                      {
                        cancelable: true,
                      }
                    );
                  }}
                >
                  <Button>
                    <Text style={{ fontSize: 12, color: "#fff" }}>
                      Cancel Inquiry
                    </Text>
                  </Button>
                </TouchableOpacity>
              );
            }
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
            inquiryId={inquiryId}
          />
          <InquiryAmount
            formData={formData}
            setFormData={setFormData}
            amountData={amountData}
            newInquiry={newInquiry}
            inquiryType={inquiryType}
            hasDownpayment={hasDownpayment}
          />
          <InquiryButton
            inquiryId={inquiryId}
            formData={formData}
            amountData={amountData}
            hasDownpayment={hasDownpayment}
            newInquiry={newInquiry}
            pendingInquiry={pendingInquiry}
            onPayment={(type, amount) => onPayment(type, amount)}
            onSubmit={onSubmit}
            inquiryType={inquiryType}
            setRefresh={() => setRefresh(true)}
            setIsLoading={setIsLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Inquire;
