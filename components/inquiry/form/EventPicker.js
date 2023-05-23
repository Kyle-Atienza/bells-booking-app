import React from "react";
import { Modal, Portal, Text } from "react-native-paper";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import { SIZES } from "../../../constants";

const eventOptions = [
  "Birthday",
  "Debut",
  "Wedding Anniversary",
  "Wedding Reception",
  "Christening",
  "Family Gathering",
  "Friends Gathering",
  "Team Building",
  "Company Event",
  "Church Event",
];

export const EventPicker = ({ visible, hideModal, onSelect }) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: SIZES.large,
          margin: SIZES.large,
          borderRadius: 10,
        }}
      >
        <Text variant="bodyLarge">Event Types</Text>
        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <ScrollView
              style={{
                height: Dimensions.get("window").height / 3,
              }}
            >
              {eventOptions.map((option, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(option);
                      hideModal();
                    }}
                    key={index}
                    style={{
                      paddingVertical: 15,
                      borderBottomColor: "#D9D9D9",
                      borderBottomWidth:
                        index + 1 >= eventOptions.length ? 0 : 1,
                    }}
                  >
                    <Text variant="bodyMedium">{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};
