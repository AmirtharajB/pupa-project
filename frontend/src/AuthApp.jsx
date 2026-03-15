import React, { useState } from 'react';
import './App.css';
 
function AuthApp({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpMsg, setSignUpMsg] = useState({ text: '', isError: false });
  const [signInMsg, setSignInMsg] = useState({ text: '', isError: false });
 
  // ── Sign Up Submit ──────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignUpMsg({ text: '', isError: false });
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpData)
      });
      const data = await response.json();
      if (response.ok) {
        setSignUpMsg({ text: '✅ Account created! Please sign in.', isError: false });
        setSignUpData({ name: '', email: '', password: '' });
        // Auto switch to sign in after 1.5 seconds
        setTimeout(() => {
          setIsSignUp(false);
          setSignUpMsg({ text: '', isError: false });
        }, 1500);
      } else {
        setSignUpMsg({ text: data.error || 'Registration failed', isError: true });
      }
    } catch (err) {
      setSignUpMsg({ text: 'Server not connected!', isError: true });
    }
  };
 
  // ── Sign In Submit ──────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInMsg({ text: '', isError: false });
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signInData)
      });
      const data = await response.json();
      if (response.ok) {
        setSignInMsg({ text: '✅ Login successful!', isError: false });
        setTimeout(() => onLoginSuccess(data.user), 800);
      } else {
        setSignInMsg({ text: data.error || 'Login failed', isError: true });
      }
    } catch (err) {
      setSignInMsg({ text: 'Server not connected!', isError: true });
    }
  };
 
  return (
    <div className="auth-body">
      <div className={`container ${isSignUp ? "right-panel-active" : ""}`}>
 
        {/* ── Sign Up Form ── */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            {signUpMsg.text && (
              <span className={signUpMsg.isError ? "error-msg" : "success-msg"}>
                {signUpMsg.text}
              </span>
            )}
            <span className="subtitle">or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={signUpData.name}
              onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpData.email}
              onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
              required
            />
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                required
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                  {!showPassword && <line x1="3" y1="21" x2="21" y2="3"></line>}
                </svg>
              </span>
            </div>
            <button type="submit" className="main-btn">SIGN UP</button>
          </form>
        </div>
 
        {/* ── Sign In Form ── */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignIn}>
            <h1>Sign in</h1>
            {signInMsg.text && (
              <span className={signInMsg.isError ? "error-msg" : "success-msg"}>
                {signInMsg.text}
              </span>
            )}
            <span className="subtitle">or use your account</span>
            <input
              type="email"
              placeholder="Email"
              value={signInData.email}
              onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
              required
            />
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                required
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                  {!showPassword && <line x1="3" y1="21" x2="21" y2="3"></line>}
                </svg>
              </span>
            </div>
            <a href="#" className="forgot">Forgot your password?</a>
            <button type="submit" className="main-btn">SIGN IN</button>
          </form>
        </div>
 
        {/* ── Overlay ── */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={() => { setIsSignUp(false); setSignInMsg({ text: '', isError: false }); }}>
                SIGN IN
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" onClick={() => { setIsSignUp(true); setSignUpMsg({ text: '', isError: false }); }}>
                SIGN UP
              </button>
            </div>
          </div>
        </div>
 
      </div>
    </div>
  );
}
 
export default AuthApp;