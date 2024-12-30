import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate  } from 'react-router-dom';
import RegisterPage from './components/RegisterPage.tsx';
import SignInPage from './components/SignInPage.tsx';
import DashboardPage from './components/DashboardPage.tsx';
import TraineeDash from './components/TraineeDash.tsx';
import TrainerDash from './components/TrainerDash.tsx';

const App: React.FC = () => {
  const [signedIn, setSignedIn] = React.useState(false);

  const [user, setUser] = useState<{
    name: string;
    gym: string;
    workoutType: string;
    timings: string;
    idealRate: string;
    userType: 'trainee' | 'trainer';
  } | null>(null);

  const handleSignIn = (userInfo: {
    name: string;
    gym: string;
    workoutType: string;
    timings: string;
    idealRate: string;
    userType: 'trainee' | 'trainer';
  }) => {
    setSignedIn(true);
    console.log("Sign in is true")
    setUser(userInfo);
    console.log("User info set")
  };

  const handleSignOut = () => {
    setSignedIn(false);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage onSignIn={handleSignIn} />} />  {/* Set SignInPage as the default page */}
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            signedIn && user ? (
              user.userType === 'trainee' ? (
              <>
                {console.log("going trainee dash")}
                <TraineeDash
                  name={user.name}
                  gym={user.gym}
                  workoutType={user.workoutType}
                  timings={user.timings}
                  idealRate={user.idealRate}
                  userType={user.userType}
                  onSignOut={handleSignOut}
                />
              </>
              ) : (
              <>
                {console.log("going trainer dash")}
                <TrainerDash
                  name={user.name}
                  gym={user.gym}
                  workoutType={user.workoutType}
                  timings={user.timings}
                  idealRate={user.idealRate}
                  userType={user.userType}
                  onSignOut={handleSignOut}
                />
              </>
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
