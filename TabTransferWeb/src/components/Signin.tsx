import { useEffect, useState } from 'react'
import { GetSignedInUser } from '../data/supabaseclient'
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { useUserStore } from '@/data/userstore';
import { Button } from './ui/button';

export interface IFormInput {
    email: string;
    password: string;
  }
const Signin = () => {
  const signInFunction = useUserStore((state) => state.signIn)
    const navigator = useNavigate()
    useEffect(() => {
        async function checkUser(){
            const signedIn = await GetSignedInUser()
                if (signedIn) {
                    navigator("/home")
                }
        }
        checkUser()
    }, [navigator])

    const schema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().min(6).max(15).required()
    })

    const [isJiggling, setIsJiggling] = useState(false);
    const handleButtonClick = () => {
        setIsJiggling(true);
        setTimeout(() => setIsJiggling(false), 500); // 500ms is the duration of the animation
      };   

    const{register,handleSubmit,formState: { errors }} = useForm<IFormInput>({
        resolver:yupResolver(schema),
      });

    function showAlertAfterAnimation(message : string) {
        setTimeout(() => {
            alert(message);
        }, 100);
    }
    
async function submitForm (formData : IFormInput) {
    try {
        
        const res = await signInFunction(formData.email, formData.password)
        if (res === false) {
          console.log("Error Signing in")
          alert("Error Signing in")
          navigator("/signin")
        }
    
        else if (res === true) {
          // Use the 'data.user' object as needed
          navigator("/home")
        }
  
      } catch (error) {
        handleButtonClick()
        if (error instanceof Error) {  // Type guard
            
            showAlertAfterAnimation(error.message)
            navigator("/signin")
          } else {
            // Handle cases where error is not an instance of Error
            handleButtonClick()
            console.error("An unknown error occurred", error);
          }
      }
        }
  return (

    <div className=" w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-6  bg-backgroud rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign In!</h1>
          <p className="text-gray-600 mb-4">Please enter your email and password</p>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandYellow"
              {...register("email")}
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandYellow"
              {...register("password")}
            />
            <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
          </div>

          <Button
            onClick={errors.password || errors.email ? handleButtonClick : () => {}}
            className={`w-full py-2 rounded-md transition-all duration-300 ${
              isJiggling ? "animate-shake" : ""
            }`}
            type="submit"
          >
            Login
          </Button>
        </form>
        <div className="text-center mt-6 flex justify-between">
        
          <Link
            to="/forgotpassword"
            className="text-foreground hover:underline font-medium"
          >
            Forgot Password
          </Link>
          
          <Link
            to="/signup"
            className="text-foreground hover:underline font-medium"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>


  )
}

export default Signin