// Instructor Registration
// src/pages/instructor/registration.tsx
/* eslint-disable @next/next/no-img-element */
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../../styles/instructor-register.module.css';
import { Button, Divider, Input } from '@nextui-org/react';

const SignUp: NextPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSignUpClick = async () => {
    // Reference any additional necessary authentification logic here


    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/addInstructor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, password, role: 'instructor' })
      });

      if (response.ok) {
        router.push('/instructor/login');
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      alert('Failed to sign up');
    }
  };

  const handleBackClick = () => {
    // Redirect user to login page
    router.push('/instructor/login');
  };
  const handleLoginClick = () => {
    // Redirect user to login page
    router.push('/instructor/login');
  };

  return (
    <>
      <div className='instructor flex justify-center w-[100vw] h-[100vh] items-center bg-gradient-to-r from-[#7887ec] to-[#bbb9b9]'>
        <img src="/images/Back-Instructor.png" alt="Back" className="absolute top-0 left-0 mt-[2vh] ml-[1vh] object-cover cursor-pointer w-[3vw] h-[3vw]" onClick={handleLoginClick} />
        <div className="flex-col justify-evenly text-center bg-white min-w-min m-[5vw] p-[2vw] flex border-solid border-2 border-primary">
          <h2 className="justify-self-center text-xl p-4 bg-[#c7d3f7] text-primary" >Create an account</h2>
          <br />
          <div className='max-h-[45vh] p-2 pt-0 overflow-y-auto'>
            <p className='my-2 text-small'>Enter the following information to create your account:</p>
            <div className='flex'>
              <Input color='primary' size='sm' className="my-1 p-2 w-1/2" type="text" labelPlacement="inside" label="First Name" value={firstName}
                onChange={(e) => setFirstName(e.target.value)} />
              <Input color='primary' size='sm' className="my-1 p-2 w-1/2" type="text" labelPlacement="inside" label="Last Name" value={lastName}
                onChange={(e) => setLastName(e.target.value)} />
            </div>
            <Input color='primary' size='sm' className="my-1 p-2" type="email" labelPlacement="inside" label="Email" value={email}
              onChange={(e) => setEmail(e.target.value)} />
            <Input color='primary' size='sm' className="my-1 p-2" type="password" labelPlacement="inside" label="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <Input color='primary' size='sm' className="my-1 p-2" type="password" labelPlacement="inside" label="Confirm Password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button color='primary' className='w-full mt-2' variant="solid" onClick={handleSignUpClick}>
              Sign Up
            </Button>
          </div>

          <Divider className='my-4 bg-secondary' />

          <div className="flex align-center justify-center text-center">
            <p className="text-center p-1">Already have an account?
            <Button color='secondary' className="w-fit h-5 m-1" variant="flat" onClick={handleLoginClick}>
              Sign In
            </Button></p>
          </div>
        </div>
      </div>
    </>

  );
};

export default SignUp;
