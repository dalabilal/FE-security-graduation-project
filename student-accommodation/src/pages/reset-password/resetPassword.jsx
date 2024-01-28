import React, { useState } from 'react';
import InputPassword from '../../component/common/input-password/inputpassword.component';
import { useNavigate } from 'react-router-dom';
import logo from '../../assests/logo.jpg';
import Home from '../../assests/home.png';
import './resetPassword.css';
import { useUser } from '../../service/UserContext';
import useNotification from '../../hook/notification.hook';

const ResetPassword = (props) => {
  const navigate = useNavigate();
  const { emailVerify } = useUser();
  const { setNotification } = useNotification();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3005/resetPassword/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailVerify, 
          newPassword,
          confirmNewPassword,
        }),
      });
  
      if (response.ok) {
        console.log('Password reset successful');
        setNotification({ message: 'Password reset successful!', status: 'success' });
        navigate('/signin');  
      } else {
        const errorData = await response.json();

        if (errorData && errorData.error === 'Invalid request body') {
          console.error(errorData.error )
        } else if (errorData && errorData.error === 'User not found') {
          console.error(errorData.error )
        } else {
          console.error('Error resetting password. Please try again.')
        }
      }
    } catch (error) {
      console.error('Server Error')
    }
  };

  return (
    <div className="main">
      <img src={Home} alt='homepage' className='img-sign' onClick={() => navigate('/')} />
      <div className="sign-in-form">
        <div className="title">
          <span style={{ fontSize: 20 }}>Reset Your Password</span>
        </div>
        <form onSubmit={handleResetPassword}>
          <InputPassword
            label='New password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <InputPassword
            label='Confirm new password'
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button type='submit'>Reset</button>
        </form>
      </div>
      <img src={logo} alt="" className='img-log' />
    </div>
  );
};

export default ResetPassword;