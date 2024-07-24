// instructor/login.tsx
/* eslint-disable @next/next/no-img-element */
import { NextPage } from 'next';
import { useRouter } from 'next/router';
// import styles from '../../styles/instructor-login.module.css';
import { useState, useEffect } from 'react';
import { Button, Divider, Input,Breadcrumbs, BreadcrumbItem, } from '@nextui-org/react';
import toast from 'react-hot-toast';

const InstructorLogin: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { reason } = router.query;

  // Check for the session expiration reason and show an alert
  useEffect(() => {
    if (reason === 'Session has expired') {
      alert('Session has expired. Please log in again.');
    }
  }, [reason]);

  const handleBackClick = async () => {
    // Redirect to the landing page
    router.push('/');
  }

  const handleSignUpClick = async () => {
    // Redirect to the instructor dashboard
    router.push('/instructor/registration');
  }

  const handleSignInClick = async () => {
    setError('');

    try {
      const response = await fetch('/api/auth/instructorLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        // Redirect to the instructor dashboard
        router.push('/instructor/dashboard');
        toast.success("Login Successful!");
      } else {
        // Handle error response
        const errorData = await response.json();
        setError(errorData.message || 'Failed to authenticate');
        // alert(`${errorData.message}`);
        toast.error(errorData.message);
      }
    } catch (error) {
      // Handle network or other errors
      setError('An error occurred. Please try again.');
      toast.error("An error occurred. Please try again.")
    }
  };

  return (
   
      <div className="instructor flex justify-center items-center min-h-[100vh] min-w-[100vw] bg-gradient-to-r from-[#7887ec] to-[#bbb9b9]">
        <div className="instructor justify-center text-center bg-white mx-auto my-auto min-w-fit p-[2vw] max-w-max flex border-solid border-2 border-primary ">
          <div >
            <h2 className="justify-self-center text-xl p-4 mb-3 text-primary bg-[#c7d3f7]">Instructor Login Portal</h2>
            
            <Input  className="my-1 p-2" type="email" labelPlacement="inside" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input  className="my-1 p-2" type="password" labelPlacement="inside" label="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <Button color='primary' className=" my-1 w-full text-medium " variant="solid" onClick={handleSignInClick}>
              Sign In
            </Button>
            <div className="flex-column align-center justify-center text-center">
              <Button className="bg-white h-fit w-fit my-1 mb-3 text-xs" variant="solid" >
                Forgot Your Password?
              </Button><Divider orientation="horizontal" className='bg-primary'/>
              <p className="mt-3 p-1 text-small">Don't have an account?</p>
              <Button color='primary' className="w-fit h-5 " variant="flat" onClick={handleSignUpClick}>
                Sign Up
              </Button>
            </div>
          </div>
          <img
            className="absolute top-0 left-0 mt-[2vh] ml-[1vh] object-cover cursor-pointer w-[3vw] h-[3vw]"
            alt="Back"
            src="/images/Back-Instructor.png"
            onClick={handleBackClick}
          />
        </div>
      </div>
   
  );
};

export default InstructorLogin;
