import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, TrendingUp } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem('finsync_user', JSON.stringify({ email }));
    nav('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 mb-3">
            <TrendingUp className="text-white h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Financial Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1 text-center">
            All your finances. One powerful dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Sign in / Sign up
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Secure • Fast • Simple
        </p>
      </div>
    </div>
  );
}
