'use client';
import Link from 'next/link';
import { useAuth } from '../xlib/auth';
import { DollarSign, TrendingUp, Shield, Bot, Wallet, PieChart, Target, MessageCircle } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
              <DollarSign className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-slate-800 mb-4">
              Welcome back, {user.username}!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage your finances with AI-powered insights and blockchain security
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Link href="/dashboard" className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Dashboard</h3>
              <p className="text-gray-600">View your financial overview</p>
            </Link>
            
            <Link href="/finance" className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Wallet className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Finance</h3>
              <p className="text-gray-600">Manage accounts and transactions</p>
            </Link>
            
            <Link href="/wealth" className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <PieChart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Wealth</h3>
              <p className="text-gray-600">Investment portfolio tracking</p>
            </Link>
            
            <Link href="/planning" className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-orange-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Planning</h3>
              <p className="text-gray-600">Goals and budget management</p>
            </Link>
            
            <Link href="/blockchain" className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Blockchain</h3>
              <p className="text-gray-600">Crypto and DeFi management</p>
            </Link>
            
            <Link href="/chat" className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-teal-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <MessageCircle className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">AI Chat</h3>
              <p className="text-gray-600">Get financial advice from AI</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-8 shadow-lg">
            <DollarSign className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-slate-800 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            EasyFinance
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered financial platform with blockchain integration, 
            intelligent planning, and comprehensive wealth management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link 
              href="/auth/login" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register" 
              className="border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-slate-800">Smart Analytics</h3>
            <p className="text-gray-600 leading-relaxed">AI-powered insights for better financial decisions and predictive analysis</p>
          </div>
          <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-slate-800">Blockchain Security</h3>
            <p className="text-gray-600 leading-relaxed">Secure crypto and DeFi management with enterprise-grade protection</p>
          </div>
          <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-slate-800">AI Assistant</h3>
            <p className="text-gray-600 leading-relaxed">24/7 financial guidance and personalized investment recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
