import React, { useState } from 'react';
import Input from '../../component/common/input/input.component';
import { useUser } from '../../service/UserContext';
import './sign-up.css';
import { Link } from 'react-router-dom';
import StrongPassword from './passwordStrength';

const SignUp = () => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailExists, setEmailExists] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstname, setFirstname] = useState('');
  const [password, setPassword] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const { setUserRole } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      setEmailExists(false); // Reset emailExists state
      return;
    }

    try {
      const response = await fetch('http://localhost:3005/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
          confirmPassword,
          phoneNumber,
          role,
        }),
      });

      if (response.status === 201) {
        console.log('User signed up successfully!');
        setUserRole(role);
        console.log('role', role);
      } else {
        const responseData = await response.json();
        if (responseData.error) {
          if (responseData.error.message === 'Email already exists') {
            setEmailExists(true);
          } else if (responseData.error.message === 'Passwords do not match') {
            setPasswordsMatch(false);
          } else {
            console.error('Failed to sign up:', responseData.error.message);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="main">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <div className="title">
          <span>Sign Up</span>
        </div>
        <Input
          label="first name"
          required
          radius={15}
          height={30}
          width={160}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <Input
          label="last name"
          required
          radius={15}
          height={30}
          width={160}
          onChange={(e) => setLastname(e.target.value)}
        />
        <Input 
        label="email"
        required
        onChange={(e) =>{
           setEmail(e.target.value)
           setEmailExists(false)
        }
      } />
        {emailExists && <span style={{ color: 'red' }}>Email already exists. Please use a different email.</span>}
        <Input
          label="phone number"
          required
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div className="role-radio">
          <label className="role">Are you : </label>
          <label>
            <input
              type="radio"
              value="owner"
              checked={role === 'owner'}
              onChange={() => setRole('owner')}
              required
            />
            <span className="radiol-label">Owner</span>
          </label>
          <label>
            <input
              type="radio"
              value="student"
              checked={role === 'student'}
              onChange={() => setRole('student')}
              required
            />
            <span className="radio-label">Student</span>
          </label>
        </div>
        <StrongPassword
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          passwordsMatch={passwordsMatch}
          setPasswordsMatch={setPasswordsMatch}
        />
        {!passwordsMatch && <span style={{ color: 'red' }}>Passwords do not match!</span>}
        <div className="span-text1">
          <span>already have an account, </span>
          <span className='signin'>
            <Link to={'/signup'}>Sign in!</Link>
          </span>
        </div>
        <div className="signIn-button">
          <button>Sign Up</button>
        </div>
        <div className="sign-in-img"></div>
        <div className="img-signin">
          <img src="pic.jpg" alt="" />
        </div>
      </form>
    </div>
  );
};

export default SignUp;
