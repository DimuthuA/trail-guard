import { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function SettingsDashboard() {
  const [contacts, setContacts] = useState([
    { id: '1', name: 'John Doe', number: '+1234567890' },
    { id: '2', name: 'Jane Smith', number: '+0987654321' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');

  const handleAddContact = () => {
    if (newContactName && newContactNumber) {
      const newContact = {
        id: Math.random().toString(),
        name: newContactName,
        number: newContactNumber,
      };
      setContacts(prevContacts => [...prevContacts, newContact]);
      setNewContactName('');
      setNewContactNumber('');
      setIsAdding(false);
    } else {
      alert('Please fill out both fields');
    }
  };

  const handleCancel = () => {
    setNewContactName('');
    setNewContactNumber('');
    setIsAdding(false);
  };

  const confirmDelete = (contactId) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact from your emergency contacts list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setContacts(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
          }
        }
      ]
    );
  };

  const renderContactItem = ({ item }) => (
    <View style={styles.contactRow}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactText}>{item.name}</Text>
        <Text style={styles.contactSubText}>{item.number}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

return (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.wrapper}
    keyboardVerticalOffset={100}
  >
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={renderContactItem}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text style={styles.title}>Emergency Contacts</Text>}
      keyboardShouldPersistTaps="handled"
    />

    <View style={styles.footer}>
      {isAdding ? (
        <View style={styles.addContactForm}>
          <TextInput
            style={styles.input}
            placeholder="Contact Name"
            value={newContactName}
            onChangeText={setNewContactName}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            value={newContactNumber}
            onChangeText={setNewContactNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#aaa"
          />
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddContact}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
          <Text style={styles.addButtonText}>+ Add Emergency Contact</Text>
        </TouchableOpacity>
      )}
    </View>
  </KeyboardAvoidingView>
);

}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    padding: 24,
    paddingBottom: 60,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'left',
    marginTop: 4,
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 12,
    marginVertical: 5,
    borderRadius: 6,
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 1,
    marginRight: 12,
  },
  contactText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 2,
  },
  contactSubText: {
    color: '#ccc',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  addContactForm: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#444',
    color: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
    fontSize: 18,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  footer: {
  padding: 24,
  backgroundColor: '#000',
  },
});