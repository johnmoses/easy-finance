'use client';

import { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Alert, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AppContext';
import { billingAPI } from '../services/api';
import { Plan, PlanFeatures } from '../types';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ProcessedPlan extends Plan {
  features: PlanFeatures;
}

// A simple check icon component
const CheckIcon = () => <Text style={styles.checkIcon}>✓</Text>;

export default function BillingScreen({ navigation }: any) {
  const [plans, setPlans] = useState<ProcessedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState<number | null>(null);
  const { subscription, refetchSubscription, loadingSubscription } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const response = await billingAPI.getPlans();
        const processedPlans = response.map((plan: Plan) => {
            return {
                ...plan,
                features: plan.features,
            };
        });
        setPlans(processedPlans);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        Alert.alert("Error", "Failed to load subscription plans. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: number) => {
    setIsSubscribing(planId);
    try {
      await billingAPI.subscribe(planId);
      await refetchSubscription(); // Refetch to update context
      Alert.alert("Success", "You have successfully subscribed to the new plan.");
    } catch (error) {
      console.error("Failed to subscribe:", error);
      Alert.alert("Subscription Error", "We couldn't process your subscription. Please check your payment method or try again.");
    } finally {
      setIsSubscribing(null);
    }
  };

  const getPlanButton = (plan: ProcessedPlan) => {
    const isCurrentPlan = subscription?.plan_id === plan.id;
    const isProcessing = isSubscribing === plan.id;

    if (plan.price < 0) {
        return (
            <TouchableOpacity 
                style={[styles.button, styles.contactButton]}
                onPress={() => Linking.openURL('mailto:sales@easyfinance.com')}
            >
              <Text style={styles.buttonText}>Contact Sales</Text>
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity 
            style={[styles.button, (isCurrentPlan || !!isSubscribing) && styles.disabledButton]}
            onPress={() => handleSubscribe(plan.id)}
            disabled={isCurrentPlan || !!isSubscribing}
        >
            <Text style={styles.buttonText}>
                {isProcessing ? 'Processing...' : (isCurrentPlan ? 'Current Plan' : 'Subscribe')}
            </Text>
        </TouchableOpacity>
    )
  }

  if (isLoading || loadingSubscription) {
    return (
        <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" />
            <Text>Loading plans...</Text>
        </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Billing</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Find the Right Plan for You</Text>
        <Text style={styles.subtitle}>Start for free, then grow with us.</Text>

        {plans.map((plan) => (
            <View key={plan.id} style={[styles.planContainer, subscription?.plan_id === plan.id && styles.currentPlanContainer]}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>
                    {plan.price < 0 ? 'Custom' : `${plan.price}`}
                    {plan.price > 0 && <Text style={styles.priceInterval}>/mo</Text>}
                </Text>
                
                <View style={styles.featuresList}>
                    <View style={styles.featureItem}><CheckIcon /><Text> {plan.features.max_accounts} Connected Accounts</Text></View>
                    <View style={styles.featureItem}><CheckIcon /><Text> {plan.features.max_wallets} Crypto Wallets</Text></View>
                    <View style={styles.featureItem}><CheckIcon /><Text> {plan.features.ai_chat ? 'AI Financial Chat' : 'Standard Chat'}</Text></View>
                    <View style={styles.featureItem}><CheckIcon /><Text> {plan.features.advanced_reporting ? 'Advanced Reporting' : 'Basic Reporting'}</Text></View>
                    <View style={styles.featureItem}><CheckIcon /><Text> {plan.features.multi_user_teams ? 'Team Members' : 'Single User'}</Text></View>
                </View>

                {getPlanButton(plan)}
            </View>
        ))}
    </ScrollView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#007AFF',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#666',
        marginBottom: 24,
    },
    planContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    currentPlanContainer: {
        borderColor: '#3b82f6',
        borderWidth: 2,
    },
    planName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    planPrice: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    priceInterval: {
        fontSize: 16,
        fontWeight: 'normal',
    },
    featuresList: {
        marginBottom: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkIcon: {
        color: '#10b981',
        marginRight: 8,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#3b82f6',
    },
    contactButton: {
        backgroundColor: '#4b5563',
    },
    disabledButton: {
        backgroundColor: '#9ca3af',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});