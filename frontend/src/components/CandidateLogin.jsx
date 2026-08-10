import React, { useState } from 'react';
import { loginCandidate } from '../services/api';
import { LogIn, UserPlus, Bot, Shield, Key, Mail } from 'lucide-react';

export default function CandidateLogin({ onLoginSuccess, onSwitchToRegister, onSwitchToAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);

    try {
      const data = await loginCandidate({ email: email.trim(), password });
      onLoginSuccess(data.candidate);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '3rem auto' }}>
      <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo-icon-glow" style={{ margin: '0 auto 1rem auto', width: '48px', height: '48px' }}>
            <Bot size={28} color="#8b6b3e" />
          </div>
          <h2 className="hero-heading" style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>
            Candidate <span className="gradient-text">Portal Login</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Sign in to access your personal candidate dashboard and start your evaluation.
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#dc2626', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              Email Address
            </label>
            <div className="search-input-wrapper">
              <Mail size={16} color="var(--text-muted)" />
              <input 
                type="email" 
                className="search-input" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              Password
            </label>
            <div className="search-input-wrapper">
              <Key size={16} color="var(--text-muted)" />
              <input 
                type="password" 
                className="search-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            <LogIn size={16} /> {loading ? 'Authenticating...' : 'Login to Portal'}
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
          <button 
            onClick={onSwitchToAdmin}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Shield size={14} /> Admin Portal View
          </button>
        </div>
      </div>
    </div>
  );
}
