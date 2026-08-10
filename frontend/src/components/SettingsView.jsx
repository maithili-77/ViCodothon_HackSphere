import React, { useState, useEffect } from 'react';
import { 
  Settings, Sliders, Cpu, Mic, Server, Shield, CheckCircle2, 
  AlertCircle, Lock, Info, Activity, Database, Save
} from 'lucide-react';
import { fetchHealth, fetchSettings, updateSettings } from '../services/api';

export default function SettingsView({ candidatesCount, onSettingsUpdated }) {
  const [healthStatus, setHealthStatus] = useState({ status: 'checking...' });
  const [minQuestions, setMinQuestions] = useState(8);
  const [minDays, setMinDays] = useState(4);
  const [difficultyPref, setDifficultyPref] = useState('ADAPTIVE');
  
  const [saveStatus, setSaveStatus] = useState(null); // success / error message
  const [saving, setSaving] = useState(false);

  const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
  const isVoiceSupported = Boolean(SpeechRecognition);

  useEffect(() => {
    checkBackendHealth();
    loadCurrentSettings();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const data = await fetchHealth();
      setHealthStatus(data);
    } catch (e) {
      setHealthStatus({ status: 'offline' });
    }
  };

  const loadCurrentSettings = async () => {
    try {
      const settings = await fetchSettings();
      if (settings.min_questions) setMinQuestions(settings.min_questions);
      if (settings.min_curriculum_days) setMinDays(settings.min_curriculum_days);
    } catch (e) {
      console.warn('Could not load current settings:', e);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaveStatus(null);

    const qVal = parseInt(minQuestions, 10);
    const dVal = parseInt(minDays, 10);

    if (isNaN(qVal) || qVal < 8) {
      setSaveStatus({ type: 'error', text: 'Minimum values are enforced by the Technical Specification: at least 8 questions.' });
      return;
    }
    if (isNaN(dVal) || dVal < 4) {
      setSaveStatus({ type: 'error', text: 'Minimum values are enforced by the Technical Specification: at least 4 curriculum days.' });
      return;
    }

    setSaving(true);
    try {
      const res = await updateSettings(qVal, dVal);
      setSaveStatus({ type: 'success', text: res.message || 'Interview settings updated successfully.' });
      if (onSettingsUpdated) onSettingsUpdated(res.settings);
    } catch (err) {
      setSaveStatus({ type: 'error', text: err.message || 'Failed to update interview settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="hero-heading">
          Platform <span className="gradient-text">Settings & Configuration</span>
        </h1>
        <p className="hero-subtext">
          Configure interview evaluation parameters, view AI model capabilities, manage voice input options, and inspect real-time system health.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Active Rules Display Box */}
        <div className="dashboard-hero-card" style={{ padding: '1.25rem 1.5rem', marginBottom: 0 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
            CURRENT INTERVIEW RULES
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Minimum Questions: </span>
              <strong style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{minQuestions}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Minimum Curriculum Days: </span>
              <strong style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{minDays}</strong>
            </div>
          </div>
        </div>

        {/* Section 1: Editable Interview Settings */}
        <form className="glass-card" onSubmit={handleSaveSettings}>
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} color="var(--primary)" /> Editable Technical Interview Configuration
          </h3>

          {saveStatus && (
            <div style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: '10px', 
              fontSize: '0.88rem', 
              marginBottom: '1.25rem',
              background: saveStatus.type === 'success' ? 'rgba(39, 131, 88, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${saveStatus.type === 'success' ? 'rgba(39, 131, 88, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: saveStatus.type === 'success' ? '#278358' : '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {saveStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {saveStatus.text}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                Minimum Questions (Tech Spec Rule ≥ 8)
              </label>
              <input 
                type="number" 
                className="chat-input" 
                value={minQuestions} 
                onChange={(e) => setMinQuestions(e.target.value)}
                min="8"
                max="30"
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem' }}>
                Minimum values are enforced by Technical Specification: 8 questions minimum.
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--primary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                Minimum Curriculum Days (Tech Spec Rule ≥ 4)
              </label>
              <input 
                type="number" 
                className="chat-input" 
                value={minDays} 
                onChange={(e) => setMinDays(e.target.value)}
                min="4"
                max="31"
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.3rem' }}>
                Minimum values are enforced by Technical Specification: 4 curriculum days minimum.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" type="submit" disabled={saving} style={{ padding: '0.7rem 1.4rem' }}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>

        {/* System Health Status Area */}
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--accent-emerald)" /> System Health & Data Status
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="stat-box" style={{ textAlign: 'left', padding: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <Server size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>FastAPI Backend</span>
              </div>
              <span className={`status-pill ${healthStatus.status === 'healthy' ? 'passed' : 'failed'}`}>
                {healthStatus.status === 'healthy' ? 'CONNECTED (200 OK)' : 'OFFLINE'}
              </span>
            </div>

            <div className="stat-box" style={{ textAlign: 'left', padding: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <Cpu size={16} color="var(--accent-purple)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>AI Inference Engine</span>
              </div>
              <span className="status-pill passed">ACTIVE (Gemini 2.5)</span>
            </div>

            <div className="stat-box" style={{ textAlign: 'left', padding: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <Database size={16} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>Candidate Dataset</span>
              </div>
              <span className="status-pill passed">LOADED ({candidatesCount} Records)</span>
            </div>

            <div className="stat-box" style={{ textAlign: 'left', padding: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <Mic size={16} color="var(--accent-amber)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>Voice Recognition</span>
              </div>
              <span className={`status-pill ${isVoiceSupported ? 'passed' : 'failed'}`}>
                {isVoiceSupported ? 'SUPPORTED' : 'UNSUPPORTED'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: AI Interviewer Settings */}
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} color="var(--accent-purple)" /> AI Model Engine Parameters
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-sidebar)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem' }}>Primary LLM Model</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Gemini 2.5 Flash REST Integration with Rule-Based Fallback Engine</div>
              </div>
              <span className="badge badge-primary">gemini-2.5-flash</span>
            </div>

            <div className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-sidebar)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem' }}>Adaptive Questioning Engine</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Evaluates answer correctness and adjusts follow-up actions dynamically</div>
              </div>
              <span className="status-pill passed">ENABLED</span>
            </div>

            <div className="setting-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-sidebar)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem' }}>Candidate Background Personalization</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Reads candidate role, experience, education, and mission dataset</div>
              </div>
              <span className="status-pill passed">ENABLED</span>
            </div>
          </div>
        </div>

        {/* Section 3: Voice Input Settings */}
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mic size={18} color="var(--accent-amber)" /> Voice Input & Speech Recognition
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-sidebar)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem' }}>Browser Speech Recognition</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Web Speech API (SpeechRecognition / webkitSpeechRecognition)</div>
              </div>
              <span className={`status-pill ${isVoiceSupported ? 'passed' : 'failed'}`}>
                {isVoiceSupported ? 'AVAILABLE' : 'UNAVAILABLE'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
