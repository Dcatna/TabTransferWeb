import { GetSignedInUser, supabase } from '@/data/supabaseclient'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import * as yup from 'yup'
import { IFormInput } from './Signin'

const Signup = () => {
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
        console.log(formData.email, formData.password)
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) {
          throw error;

        }
    
        if (data) {
          // Use the 'data.user' object as needed
          console.log(data)
          navigator("/signin")
        }
        navigator("/signin")
      } catch (error) {
        handleButtonClick()
        if (error instanceof Error) {  // Type guard
            showAlertAfterAnimation(error.message)
            
          } else {
            // Handle cases where error is not an instance of Error
            handleButtonClick()
            console.error("An unknown error occurred", error);
          }
      }
        }
  return (

    <div className=" w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-violet-600 mb-2">Sign Up!</h1>
          <p className="text-gray-600 mb-4">Please enter your email and password</p>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              {...register("email")}
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              {...register("password")}
            />
            <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
          </div>

          <button
            onClick={errors.password || errors.email ? handleButtonClick : () => {}}
            className={`w-full py-2 text-white bg-violet-500 hover:bg-violet-600 rounded-md transition-all duration-300 ${
              isJiggling ? "animate-shake" : ""
            }`}
            type="submit"
          >
            Create Account
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          By creating an account in, you agree to our terms and conditions 😉
        </p>

        <div className="text-center mt-6">
          <p className="text-gray-600">Already have an account?</p>
          <Link
            to="/signin"
            className="text-violet-500 hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>


  )
}

export default Signup