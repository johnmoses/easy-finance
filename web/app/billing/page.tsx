'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../xlib/auth';
import { billingService } from '../../xlib/services';
import { Plan } from '../../types';

// A simple check icon component
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState<number | null>(null);
  const { subscription, refetchSubscription, loadingSubscription } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const response = await billingService.getPlans();
        setPlans(response.data);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: number) => {
    setIsSubscribing(planId);
    try {
      await billingService.subscribe(planId);
      await refetchSubscription(); // Refetch to update context
    } catch (error) {
      console.error("Failed to subscribe:", error);
      // Here you would show an error toast to the user
    } finally {
      setIsSubscribing(null);
    }
  };

  const getPlanButton = (plan: Plan) => {
    const isCurrentPlan = subscription?.plan.id === plan.id;
    const isProcessing = isSubscribing === plan.id;

    if (plan.price < 0) {
        return (
            <a href="mailto:sales@easyfinance.com" className="w-full text-center py-3 px-6 text-lg font-semibold rounded-lg transition-colors bg-gray-800 text-white hover:bg-gray-900">
              Contact Sales
            </a>
        )
    }

    return (
        <button 
            onClick={() => handleSubscribe(plan.id)}
            disabled={isCurrentPlan || !!isSubscribing}
            className="w-full py-3 px-6 text-lg font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
            {isProcessing ? 'Processing...' : (isCurrentPlan ? 'Current Plan' : 'Subscribe')}
        </button>
    )
  }

  if (isLoading || loadingSubscription) {
    return <div className="text-center p-10">Loading plans...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Find the Right Plan for You</h1>
        <p className="text-lg text-center text-gray-600 mb-12">Start for free, then grow with us.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} className={`bg-white rounded-lg shadow-lg p-6 flex flex-col ${subscription?.plan.id === plan.id ? 'border-2 border-blue-500' : ''}`}>
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              <p className="text-4xl font-extrabold mb-6">{plan.price < 0 ? 'Custom' : `$${plan.price}`}{plan.price > 0 ? <span className="text-lg font-medium">/mo</span> : null}</p>
              
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center"><CheckIcon /><span>{plan.features.max_accounts} Connected Accounts</span></li>
                <li className="flex items-center"><CheckIcon /><span>{plan.features.max_wallets} Crypto Wallets</span></li>
                <li className="flex items-center"><CheckIcon /><span>{plan.features.ai_chat ? 'AI Financial Chat' : 'Standard Chat'}</span></li>
                <li className="flex items-center"><CheckIcon /><span>{plan.features.advanced_reporting ? 'Advanced Reporting' : 'Basic Reporting'}</span></li>
                <li className="flex items-center"><CheckIcon /><span>{plan.features.multi_user_teams ? 'Team Members' : 'Single User'}</span></li>
              </ul>

              {getPlanButton(plan)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
