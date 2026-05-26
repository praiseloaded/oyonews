'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Bell } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('https://api.oyonews.com.ng/wp-json/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMsg(data?.message || 'Subscription failed. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('An error occurred. Please check your connection and try again.');
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
      role="form"
      aria-label="Newsletter Subscription"
    >
      <form onSubmit={handleSubmit}>
        <div className="text-center mb-6">
          <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
          <p className="text-blue-100 text-sm">
            Get the latest news delivered straight to your inbox
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="bg-white/20 border-white/30 text-white placeholder:text-blue-100 focus:bg-white/30"
            aria-label="Email address"
          />
          <Button
            type="submit"
            className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold"
            disabled={status === 'loading'}
          >
            <Bell className="h-4 w-4 mr-2" />
            {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
          </Button>
        </div>

        <div className="mt-4 text-center text-sm">
          <p className="text-blue-100">
            Join 50,000+ readers • No spam • Unsubscribe anytime
          </p>
          {status === 'success' && (
            <p className="text-green-300 mt-2">Subscription successful!</p>
          )}
          {status === 'error' && (
            <p className="text-red-300 mt-2">{errorMsg}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Newsletter;
