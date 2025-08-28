'use client';
import Link from 'next/link';
import { useAuth } from '../xlib/auth';
import { DollarSign, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <DollarSign className="h-8 w-8" />
            <span>EasyFinance</span>
          </Link>
          
          {user && (
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              <Link href="/finance" className="hover:text-blue-200">Finance</Link>
              <Link href="/wealth" className="hover:text-blue-200">Wealth</Link>
              <Link href="/blockchain" className="hover:text-blue-200">Blockchain</Link>
              <Link href="/chat" className="hover:text-blue-200">Chat</Link>
              <Link href="/support" className="hover:text-blue-200">Support</Link>
              
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{user.username}</span>
                <button onClick={logout} className="hover:text-blue-200">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}