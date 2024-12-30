import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/signin.css';

interface SignInProps {
  onSignIn: (userType: 'trainee' | 'trainer') => void;
}

const SignInPage: React.FC<SignInProps> = ({ onSignIn }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userType, setUserType] = useState<'trainee' | 'trainer'>('trainee'); // Default to 'trainee'

  const navigate = useNavigate();

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    console.log('Sign In Data:', { username, password, userType });

    // Call onSignIn with the user type
    onSignIn(userType);
    navigate(userType === 'trainee' ? '/dashboard' : '/trainer-dashboard');
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Gym Training App</h1>
      <h1>Sign In</h1>
      <form className="auth-form" onSubmit={handleSignIn}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
        
        {/* User Type Selection */}
        <div className="button-group">
          <button
            type="button"
            className={`role-button ${userType === 'trainee' ? 'active' : ''}`}
            onClick={() => setUserType('trainee')}
          >
            Trainee
          </button>
          <button
            type="button"
            className={`role-button ${userType === 'trainer' ? 'active' : ''}`}
            onClick={() => setUserType('trainer')}
          >
            Trainer
          </button>
        </div>

        <button type="submit" className="auth-submit-button">Sign In</button>
      </form>
      <p className="auth-text">
        Don't have an account? <Link to="/register" className="auth-link">Register</Link>
      </p>
    </div>
  );
};

export default SignInPage;