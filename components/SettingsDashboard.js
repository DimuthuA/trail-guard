import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import colors from '../constants/colors';

export default function SettingsDashboard() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');

  const inputNameRef = useRef(null);
  const inputNumberRef = useRef(null);

/*   
  useEffect(() => {
    const loadContacts = async () => {
      const stored = await AsyncStorage.getItem('emergencyContacts');
      if (stored) setContacts(JSON.parse(stored));
    };
    loadContacts();
  }, []);
 */

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const stored = await AsyncStorage.getItem('emergencyContacts');
        if (stored) setContacts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load contacts', e);
      } finally {
        setLoading(false);
      }
    };
    loadContacts();
  }, []);

/* 
  const handleAddContact = async () => {
    if (newContactName && newContactNumber) {
      const newContact = {
        id: Date.now().toString(),
        name: newContactName,
        number: newContactNumber,
      };
      const newContacts = [...contacts, newContact];
      setContacts(newContacts);
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify(newContacts));
      setNewContactName('');
      setNewContactNumber('');
      setIsAdding(false);
    } else {
      alert('Please fill out both fields');
    }
  };
 */

  const saveContacts = async (updatedContacts) => {
    try {
      await AsyncStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
      setContacts(updatedContacts);
    } catch (e) {
      console.error('Failed to save contacts', e);
      Alert.alert('Error', 'Could not save contact.');
    }
  };

  const handleAddContact = async () => {
    const name = newContactName.trim();
    const number = newContactNumber.trim();

    if (!name || !number) {
      Alert.alert('Validation', 'Please enter both name and number.');
      return;
    }
    if (!/^\+?\d{8,15}$/.test(number)) {
      alert('Enter a valid phone number (8–15 digits, optional + at start)');
      return;
    }
    const newContact = {
      id: Date.now().toString(),
      name,
      number,
    };

    const updatedContacts = [...contacts, newContact];
    saveContacts(updatedContacts);

    setNewContactName('');
    setNewContactNumber('');
    setIsAdding(false);
    
    inputNameRef?.current?.blur();
    inputNumberRef?.current?.blur();
    Keyboard.dismiss();
  };


  const handleCancel = () => {
    setNewContactName('');
    setNewContactNumber('');
    setIsAdding(false);
    
    inputNameRef?.current?.blur();
    inputNumberRef?.current?.blur();
    Keyboard.dismiss();
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
          onPress: async () => {
            const updated = contacts.filter(c => c.id !== contactId);
            saveContacts(updated);
          }
        }
      ],
      { cancelable: true }
    );
  };

  const renderContactItem = ({ item }) => (
    <View style={styles.contactRow}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactText}>{item.name}</Text>
        <Text style={styles.contactSubText}>{item.number}</Text>
      </View>
      <TouchableOpacity onPress={() => confirmDelete(item.id)}>
        <Ionicons name="trash" size={30} color="#ccc" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.wrapper, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#ccc', fontSize: 16 }}>Loading contacts...</Text>
      </View>
    );
  }


  return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.wrapper}>
            {/* Contact List */}
            {!isAdding && (
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Emergency Contacts</Text>
                <FlatList
                  style={{ flex: 1 }}
                  data={contacts}
                  keyExtractor={(item) => item.id}
                  renderItem={renderContactItem}
                  ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
                  )}
                  contentContainerStyle={styles.container}
                  keyboardShouldPersistTaps="always"
                />
              </View>
            )}
    
            {/* Footer Add Button */}
            {!isAdding && (
              <View style={styles.footer}>
                <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
                  <Text style={styles.addButtonText}>+ Add Emergency Contact</Text>
                </TouchableOpacity>
              </View>
            )}
    
            {/* Fullscreen overlay form */}
            {isAdding && (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
                keyboardVerticalOffset={20}
              >
              
              <View style={styles.addContactForm}>
                <Text style={styles.addContactFormTitle}>Add Emergency Contact</Text>
                <TextInput
                  ref={inputNameRef}
                  style={styles.input}
                  placeholder="Contact Name"
                  value={newContactName}
                  onChangeText={setNewContactName}
                  placeholderTextColor="#aaa"
                  autoCapitalize="words"
                />
                <TextInput
                  ref={inputNumberRef}
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
              </KeyboardAvoidingView>
            )}
          </View>
        </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.mainBackgroundColor,
  },

  container: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.mainBackgroundColor,
    paddingBottom: 120
  },

  title: {
    fontSize: 20,
    color: colors.tertiaryTextColor,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 14
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mainBackgroundColor,
    paddingLeft: 14,
    paddingRight: 10,
    marginVertical: 12,
    borderRadius: 10,
    justifyContent: 'space-between',
  },

  contactInfo: {
    flex: 1,
    marginRight: 12,
  },

  contactText: {
    color: colors.primaryTextColor,
    fontSize: 17,
    marginBottom: 2,
  },

  contactSubText: {
    color: colors.tertiaryTextColor,
    fontSize: 15,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.mainBackgroundColor,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  addContactFormTitle: {
    fontSize: 18,
    color: colors.secondaryTextColor,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 22,
    fontWeight: 'bold',
  },

  addContactForm: {
    backgroundColor: colors.addContactFormBackgroundColor,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10
  },

  input: {
    backgroundColor: '#222',
    color: colors.primaryTextColor,
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    fontSize: 17,
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginHorizontal: 2
  },

  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: colors.primaryTextColor,
    fontSize: 17,
    fontWeight: 'bold',
  },

  footer: {
    paddingHorizontal: 12,
    paddingVertical: 20,
    backgroundColor: colors.titleBarBackgroundColor,
    
    // Elevation for Android
    elevation: 10,

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2, // shadow appears above the footer
    },

    shadowOpacity: 0.2,
    shadowRadius: 4
  },

  addButton: {
    backgroundColor: colors.addEmergencyContactButtonBackgroundColor,
    paddingVertical: 20,
    borderRadius: 60,
    alignItems: 'center'
  },

  addButtonText: {
    color: colors.primaryTextColor,
    fontSize: 17,
  }
});