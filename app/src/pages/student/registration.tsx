// Student Registration
// src/pages/student/registration.tsx
/* eslint-disable @next/next/no-img-element */
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../../styles/student-register.module.css';
import { Button, Divider, Input, ScrollShadow } from '@nextui-org/react';

const SignUp: NextPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const router = useRouter();

  const handleSignUpClick = async () => {
    // Reference any additional necessary authentification logic here


    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

        try {
            const response = await fetch('/api/addNew/addStudent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, email, password, role: 'student'})
            });

      if (response.ok) {
        router.push('/student/login');
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      alert('Failed to sign up');
    }
  };

  const handleLoginClick = () => {
    // Redirect user to login page
    router.push('/student/login');
  }

  return (
    <body className="student flex justify-center items-center bg-gradient-to-r from-[#459992] to-[#bbb9b9] text-black">
      <img src="/images/Student/Back-Student.png" alt="Back" className="absolute top-0 left-0 mt-[2vh] ml-[1vh] object-cover cursor-pointer w-[3vw] h-[3vw]" onClick={handleLoginClick} />
      <div className="flex-col justify-evenly text-center bg-white min-w-fit p-[2vw] flex border-solid border-2 border-primary">
        <h2 className="justify-self-center text-xl p-4 bg-[#c0dfdc] text-primary" >Create an account</h2>
        <br />
        <div className='max-h-[45vh] p-2 overflow-y-auto'>
          <p className='my-2 text-small'>Enter the following information to create your account:</p>
          <div className='flex'>
            <Input size='sm' className="my-1 p-2 w-1/2" type="text" labelPlacement="inside" label="First Name" value={firstName}
              onChange={(e) => setFirstName(e.target.value)} />
            <Input  size='sm' className="my-1 p-2 w-1/2" type="text" labelPlacement="inside" label="Last Name" value={lastName}
              onChange={(e) => setLastName(e.target.value)} />
          </div>
          <Input  size='sm' className="my-1 p-2" type="email" labelPlacement="inside" label="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <Input  size='sm' className="my-1 p-2" type="password" labelPlacement="inside" label="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <Input  size='sm' className="my-1 p-2" type="password" labelPlacement="inside" label="Confirm Password" value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} />
          
          <Button color='primary' className='w-full mt-2' variant="solid" onClick={handleSignUpClick}>
            Sign Up
          </Button>
        </div>

        <Divider className='my-4 bg-secondary' />

        <div className="flex-row align-center justify-center text-center">
          <p className="text-center p-1">Already have an account?
          <Button color='primary' className="w-fit h-5 m-1" variant="flat" onClick={handleLoginClick}>
            Sign In
          </Button></p>
        </div>
      </div>
    </body>

  );
};

export default SignUp;