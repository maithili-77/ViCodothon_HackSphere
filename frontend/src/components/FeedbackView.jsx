import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRightCircle, RefreshCw, Award } from 'lucide-react';

export default function FeedbackView({ candidate, feedback, onRestart }) {
  const member = candidate?.member || {};
  const strengths = feedback?.strengths || [];
  const gaps = feedback?.gaps || [];
  const nextSteps = feedback?.next || [];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', padding: '0.6rem 1.2rem', borderRadius: '9999px', background: 'rgba(39, 131, 88, 0.12)', border: '1px solid rgba(39, 131, 88, 0.3)', color: '#278358', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>
          <Award size={18} style={{ marginRight: '6px' }} /> Technical Interview Completed
        </div>
        <h1 className="hero-heading">Candidate Evaluation Report</h1>
        <p className="hero-subtext" style={{ margin: '0 auto' }}>
          Performance assessment for <strong>{member.name}</strong> ({member.jobRole}, {member.yearsExperience} yrs exp)
        </p>
      </div>

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div className="feedback-section-title" style={{ color: 'var(--primary)' }}>
          Executive Summary
        </div>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: '1.7' }}>
          {feedback?.summary}
        </p>
      </div>

      <div className="feedback-grid">
        {/* Strengths */}
        <div className="glass-card">
          <div className="feedback-section-title" style={{ color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={20} /> Observed Strengths
          </div>
          <ul className="feedback-list strengths">
            {strengths.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Technical Gaps */}
        <div className="glass-card">
          <div className="feedback-section-title" style={{ color: 'var(--accent-amber)' }}>
            <AlertTriangle size={20} /> Areas Needing Improvement
          </div>
          <ul className="feedback-list gaps">
            {gaps.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Actionable Next Steps */}
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <div className="feedback-section-title" style={{ color: 'var(--accent-cyan)' }}>
            <ArrowRightCircle size={20} /> Recommended Curriculum Next Steps
          </div>
          <ul className="feedback-list next">
            {nextSteps.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <button className="btn btn-primary" onClick={onRestart} style={{ padding: '0.9rem 2rem' }}>
          <RefreshCw size={18} /> Interview Another Candidate
        </button>
      </div>
    </div>
  );
}
