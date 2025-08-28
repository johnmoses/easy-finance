import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { authAPI, billingAPI } from '../services/api';
import { User } from '../types';
import { useBilling } from '../context/AppContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollView: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileContainer: {
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    width: 120,
    fontSize: 16,
  },
  value: {
    flex: 1,
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  logoutButtonText: {
    color: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  cancelButtonText: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  billingContainer: {
    paddingBottom: 20,
  },
  subscriptionInfo: {
    padding: 20,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  noSubscriptionText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 10,
  },
  planFeatures: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
});

const ProfileScreen = ({ navigation }: any) => {
  const { plans, subscription, setPlans, setSubscription } = useBilling();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User> | null>(null);
  const [passwords, setPasswords] = useState({ old_password: '', new_password: '' });

  const fetchUser = async () => {
    try {
      setLoading(true);
      const profile = await authAPI.profile();
      setUser(profile);
      setEditedUser(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to fetch profile.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBillingData = async () => {
    try {
      const fetchedPlans = await billingAPI.getPlans();
      setPlans(fetchedPlans);

      const fetchedSubscription = await billingAPI.getSubscription();
      setSubscription(fetchedSubscription);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      Alert.alert('Error', 'Failed to fetch billing data.');
      // Handle error, e.g., set subscription to null or show a message
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
      fetchBillingData();
    }, []),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      fetchUser(),
      fetchBillingData(),
    ]).finally(() => setRefreshing(false));
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await authAPI.logout();
            navigation.replace('Auth');
          } catch (error) {
            console.log('Logout error:', error);
            Alert.alert('Error', 'Logout failed.');
          }
        },
      },
    ]);
  };

  const handleUpdateProfile = async () => {
    if (editedUser) {
      try {
        await authAPI.updateProfile(editedUser);
        setIsEditModalVisible(false);
        fetchUser(); // Refresh user data
        Alert.alert('Success', 'Profile updated successfully.');
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile.');
      }
    }
  };

  const handleChangePassword = async () => {
    try {
      await authAPI.changePassword(passwords);
      setIsChangePasswordModalVisible(false);
      setPasswords({ old_password: '', new_password: '' });
      Alert.alert('Success', 'Password changed successfully.');
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password.');
    }
  };

  const handleSubscribe = async (planId: number) => {
    try {
      await billingAPI.subscribe(planId);
      Alert.alert('Success', 'Successfully subscribed to the new plan!');
      fetchBillingData(); // Refresh billing data
    } catch (error) {
      console.error('Error subscribing:', error);
      Alert.alert('Error', 'Failed to subscribe.');
    }
  };

  const handleCancelSubscription = async () => {
    Alert.alert('Cancel Subscription', 'Are you sure you want to cancel your subscription?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await billingAPI.cancelSubscription();
            Alert.alert('Success', 'Subscription cancelled successfully.');
            fetchBillingData(); // Refresh billing data
          } catch (error) {
            console.error('Error cancelling subscription:', error);
            Alert.alert('Error', 'Failed to cancel subscription.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {user && (
          <View style={styles.profileContainer}>
            <View style={styles.profileInfo}>
              <Text style={styles.label}>Username:</Text>
              <Text style={styles.value}>{user.username}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.label}>Role:</Text>
              <Text style={styles.value}>{user.role}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.label}>Member Since:</Text>
              <Text style={styles.value}>{new Date(user.created_at).toLocaleDateString()}</Text>
            </View>
          </View>
        )}

        {/* Billing Section */}
        <View style={styles.billingContainer}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          {subscription ? (
            <View style={styles.subscriptionInfo}>
              <Text style={styles.label}>Plan:</Text>
              <Text style={styles.value}>{plans.find(p => p.id === subscription.plan_id)?.name || 'Unknown'}</Text>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{subscription.status}</Text>
              {subscription.end_date && (
                <>
                  <Text style={styles.label}>Active Until:</Text>
                  <Text style={styles.value}>{new Date(subscription.end_date).toLocaleDateString()}</Text>
                </>
              )}
            </View>
          ) : (
            <Text style={styles.noSubscriptionText}>No active subscription.</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Billing')}
          >
            <Text style={styles.buttonText}>Manage Subscription</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setIsEditModalVisible(true)}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setIsChangePasswordModalVisible(true)}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={editedUser?.username}
              onChangeText={text => setEditedUser(prev => ({ ...prev, username: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editedUser?.email}
              onChangeText={text => setEditedUser(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleUpdateProfile}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={isChangePasswordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsChangePasswordModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              secureTextEntry
              onChangeText={text => setPasswords({ ...passwords, old_password: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              onChangeText={text => setPasswords({ ...passwords, new_password: text })}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsChangePasswordModalVisible(false)}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;