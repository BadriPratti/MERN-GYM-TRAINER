import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterPage from './components/RegisterPage.tsx';
import SignInPage from './components/SignInPage.tsx';
import TraineeDash from './components/TraineeDash.tsx';
import TrainerDash from './components/TrainerDash.tsx';

const App: React.FC = () => {
  const [signedIn, setSignedIn] = React.useState(false);
  const [userType, setUserType] = React.useState<'trainee' | 'trainer' | null>(null);

  const handleSignIn = (type: 'trainee' | 'trainer') => {
    setSignedIn(true);
    setUserType(type);
  };

  const handleSignOut = () => {
    setSignedIn(false);
    setUserType(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage onSignIn={handleSignIn} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={signedIn && userType === 'trainee' ? (
            <TraineeDash
              name="John Doe"
              gym="UCF RWC"
              workoutType="Bulk"
              timings="Morning (7AM-12PM)"
              idealRate="Basic ($10-$20)"
              userType="trainee"
              onSignOut={handleSignOut}
            />
          ) : (
            <Navigate to="/" replace />
          )}
        />
        <Route
          path="/trainer-dashboard"
          element={signedIn && userType === 'trainer' ? (
            <TrainerDash
              name="Jane Doe"
              gym="Planet Fitness"
              workoutType="Cut"
              timings="Morning (7AM-12PM)"
              idealRate="Premium ($20-$30)"
              userType="trainer"
              onSignOut={handleSignOut}
            />
          ) : (
            <Navigate to="/" replace />
          )}
        />
      </Routes>
    </Router>
  );
};

export default App;