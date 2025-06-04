import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const ConfirmationModal = ({ 
  visible, 
  title, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  onConfirm, 
  onClose, 
  showCancel = true,
  confirmDisabled = false
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          
          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.confirmButton,
                confirmDisabled && styles.disabledButton
              ]}
              onPress={onConfirm}
              disabled={confirmDisabled}
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ConfirmationModal;