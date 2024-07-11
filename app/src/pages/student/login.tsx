// student/login.tsx
/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../../styles/student-login.module.css";
import { useState, useEffect } from "react";
import {Button, Chip, Input, Divider} from "@nextui-org/react";

const StudentLogin: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { reason } = router.query;

  // Check for the session expiration reason and show an alert
  useEffect(() => {
    if (reason === "Session has expired") {
      alert("Session has expired. Please log in again.");
    }
  }, [reason]);

  const handleBackClick = async () => {
    // Redirect to the landing page
    router.push("/");
  };

  const handleSignUpClick = async () => {
    // Redirect to the student dashboard
    router.push("/student/registration");
  };


  const handleSignInClick = async () => {
    setError("");

    try {
      const response = await fetch("/api/auth/studentLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Redirect to the student dashboard
        router.push("/student/dashboard");
      } else {
        // Handle error response
        const errorData = await response.json();
        setError(errorData.message || 'Failed to authenticate');
        alert(`${errorData.message}`);
      }
    } catch (error) {
      // Handle network or other errors
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
    <body className="student p-3 pt-12 justify-center">
    <div className="student justify-center text-center mx-auto my-auto min-w-fit p-[2vw] max-w-max flex border-solid border-2 border-[#39776f] ">
       <div >
       <h2 className="justify-self-center text-xl p-4  border-[#39776f] border-2 text-[#39776f]">Student Login Portal</h2>
      <Divider />
        <Input className="my-1 p-2" type="email" labelPlacement="inside" label="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <Input className="my-1 p-2" type="password" labelPlacement="inside" label="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}/> 
        <Button className="bg-[#39776f] text-white my-1 w-full text-medium " variant="solid" onClick={handleSignInClick}>
        Sign In
      </Button>
      <div className="flex-column align-center justify-center text-center">
        <Button className="bg-white h-fit w-fit my-1 mb-3 text-xs text-[#39776f]" variant="solid" onClick={handleSignInClick}>
        Forgot Your Password?
      </Button><Divider orientation="horizontal"/>
      <p className="mt-3 p-1 text-small">Don't have an account?</p>
      <Button className="w-fit h-5 bg-[#c6e8e4]" variant="flat"  onClick={handleSignUpClick}>
        Sign Up
      </Button>
      </div>
      
      
       </div>
        
        <img
          className={styles.backIcon}
          alt="Back"
          src="/images/Back-Arrow.png"
          onClick={handleBackClick}
        />
      </div>
    </body>
    
    </>
  );
};

export default StudentLogin;
