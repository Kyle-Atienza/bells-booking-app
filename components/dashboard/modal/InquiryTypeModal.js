import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Chip, Modal, Portal, Text } from "react-native-paper";
import { SIZES } from "../../../constants";

export const InquiryTypeModal = ({ visible, hideModal }) => {
  const router = useRouter();

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
        <Text variant="bodyLarge">Please select your type of inquiry</Text>
        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                router.push("/inquiry/apartment");
                hideModal();
              }}
            >
              <Chip style={{ height: 30, borderRadius: 100 }}>
                <Text variant="titleSmall">Apartment</Text>
              </Chip>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/inquiry/event");
                hideModal();
              }}
            >
              <Chip style={{ height: 30, borderRadius: 100 }}>
                <Text variant="titleSmall">Event</Text>
              </Chip>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};
