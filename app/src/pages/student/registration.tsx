// Student Registration
// src/pages/student/registration.tsx
/* eslint-disable @next/next/no-img-element */
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../../styles/student-register.module.css';
import { Button, Divider, Input } from '@nextui-org/react';

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
            const response = await fetch('/api/addStudent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, email, password, role: 'student', institution })
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
      <body className="student p-3 pt-12 justify-center">
        <div className="student flex-col justify-evenly text-center mx-auto my-auto min-w-fit p-[2vw] max-w-max flex border-solid border-2 border-[#39776f] ">
        <h2 className="justify-self-center text-xl p-4 bg-[#a7d6d1] text-[#113334]">Create an account</h2>
        <p className='my-2 text-small'>Enter the following information to create your account:</p>
        <Input className="my-1 p-2" type="text" labelPlacement="inside" label="First Name" value={firstName}
          onChange={(e) => setFirstName(e.target.value)}/>
        <Input className="my-1 p-2" type="text" labelPlacement="inside" label="Last Name" value={lastName}
          onChange={(e) => setLastName(e.target.value)}/>
        <Input className="my-1 p-2" type="email" labelPlacement="inside" label="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}/>
        <Input className="my-1 p-2" type="password" labelPlacement="inside" label="Password" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}/>
        <Input className="my-1 p-2" type="text" labelPlacement="inside" label="Confirm Password" value={lastName}
          onChange={(e) => setLastName(e.target.value)}/>
        <Input className="my-1 p-2" type="text" labelPlacement="inside" label="Institution" value={institution}
          onChange={(e) => setInstitution(e.target.value)}/>
       <Button className="bg-[#39776f] text-white my-2 w-full text-medium mb-5" variant="solid" onClick={handleSignUpClick}>
        Sign In
      </Button>
       <Divider/> 
      <div className="flex-column align-center justify-center text-center">
        <p className="mt-3 p-1 text-small text-center">Already have an account?</p>
        <Button className="w-fit h-5 bg-[#c6e8e4] text-center" variant="flat"  onClick={handleLoginClick}>
          Sign In
        </Button>   
      </div>
      </div>
      </body>
      
    );
    };
    
    export default SignUp;