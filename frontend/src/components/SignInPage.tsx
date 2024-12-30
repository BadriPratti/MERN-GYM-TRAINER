import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/signin.css';

interface SignInProps {
  onSignIn: (userInfo: {
    name: string;
    gym: string;
    workoutType: string;
    timings: string;
    idealRate: string;
    userType: 'trainee' | 'trainer';
  }) => void;
}

const SignInPage: React.FC<{ onSignIn: (userInfo: any) => void }> = ({ onSignIn }) => {
  // State for username and password inputs
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userInfo = await response.json(); 
        console.log('Sign-in successful:', userInfo);

        onSignIn({
          name: userInfo.user.firstName + ' ' + userInfo.user.lastName, // Combine first and last names
          gym: userInfo.user.locationPref, // Use locationPref for gym
          workoutType: userInfo.user.workoutType, 
          timings: userInfo.user.timings,
          idealRate: userInfo.user.idealRate, 
          userType: userInfo.user.hasTrainer === undefined ? 'trainer' : 'trainee', // Check if user is a trainer or trainee
        });        

        navigate('/dashboard');
      } else {
        console.error('Sign-in failed:', await response.json());
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Gym Training App</h1>
      <h1>Sign In</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Username input */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          required
        />
        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-submit-button">Sign In</button>
      </form>
      
      {/* Link to register page */}
      <p className="auth-text">
        Don't have an account? <Link to="/register" className="auth-link">Register</Link>
      </p>
    </div>
  );
};

export default SignInPage;