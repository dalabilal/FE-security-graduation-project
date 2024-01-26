import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../service/UserContext';
import './login.css';
import useNotification from '../../hook/notification.hook';
import InputPassword from '../../component/common/input-password/inputpassword.component';
import logo from '../../assests/logo.jpg';
import Input from '../../component/common/input/input.component';
import Home from '../../assests/home.png';
import Verification from '../verification/verification';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setNotification } = useNotification();
  const { setUserRole, setNoUser , 
    setShowVerificationCodeInput ,
    showVerificationCodeInput , 
    setVerificationCode,
    verificationCode,
    setEmailVerify
  } = useUser(); // Get setUserRole from the context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3005/signin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, verificationCode }),
      });

      if (response.ok) {
        const userData = await response.json();
        // Handle successful login here
        sessionStorage.setItem('jwtToken', userData.token);
        sessionStorage.setItem('username', userData.firstname);
        sessionStorage.setItem('userRole', userData.role);
        setUserRole(userData.role);
        setNotification({ message: 'Login successful!', status: 'success' });
      } else {
        const errorData = await response.json();
        if (errorData && errorData.message === 'Invalid credentials') {
          // Handle invalid credentials here
          setNotification({ message: 'Invalid email or password, Try again', status: 'error' });
          setNoUser(true);
          setShowVerificationCodeInput(false);
        } else
        if (errorData && errorData.message === 'Verification code sent to your email. Enter the code to proceed.') {
           setShowVerificationCodeInput(true);
           setEmailVerify(email);
           navigate('/verification')
          setNotification({ message: 'Verification code sent to your email. Enter the code to proceed.', status: 'warning' });
          setNoUser(true);
        } else {
          // Handle other errors here
          setNotification({ message: 'Server Error', status: 'warning' });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setNotification({ message: 'Server Error', status: 'warning' });
    }
  };

  return (
    <div className="main">
      <img src={Home} alt='homepage' className='img-sign' onClick={() => navigate('/')} />
      <div className="sign-in-form">
        <div className="title">
          <span>Sign In</span>
        </div>
        <form onSubmit={handleSubmit}>
            <Input
            id='email'
            label='Email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
            <InputPassword
              label='Password'
              value={password}
              placeholder="************"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          <div className="forgot-password">
            <span id='forgot-password'>forgot password?</span>
          </div>
          <div className="span-text">
            <span className="condition">You Don't have an account yet?</span>
            <span className="sign-up">
              <Link to={'/signup'}>Sign up</Link>
            </span>
          </div>
          <div className="signIn-button">
            <button type="submit">Sign In</button>
          </div>
        </form>
      </div>
      <img src={logo} alt="" className='img-log' />
    </div>
  );
};

export default SignInForm;
