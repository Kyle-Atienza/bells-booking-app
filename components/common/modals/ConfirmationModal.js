import React from "react";
import { SIZES } from "../../../constants";
import { Modal, Portal, Text } from "react-native-paper";
import { View } from "react-native";

export const ConfirmationModal = ({ visible, hideModal, label }) => {
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
        <Text variant="bodyLarge">{label}</Text>
        <View style={{ marginTop: 10 }}></View>
      </Modal>
    </Portal>
  );
};
