
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from '@/data/supabaseclient';
export interface IFormInput2 {
    email: string;
  }
const ForgotPassword = () => {
    const navigator = useNavigate()

    const schema = yup.object().shape({
        email: yup.string().email().required(),
    })

    const [isJiggling, setIsJiggling] = useState(false);
    const handleButtonClick = () => {
        setIsJiggling(true);
        setTimeout(() => setIsJiggling(false), 500);
      };   

    const{register,handleSubmit,formState: { errors }} = useForm<IFormInput2>({
        resolver:yupResolver(schema),
      });

    
    async function submitForm (formData : IFormInput2) {
        console.log("SUBMITTING FORM")
        const res = await supabase.auth.resetPasswordForEmail(formData.email, {redirectTo: "https://tabtransfer.org/passwordreset"})
        console.log(res)
        if (res.error) {
            alert("Error Resetting Password")

        } else{
            navigator("/signin")
        }
    }


  return (

    <div className=" w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brandYellow mb-2">Reset Password</h1>
          <p className="text-gray-600 mb-4">Please enter your email</p>
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
          <button
            onClick={ errors.email ? handleButtonClick : () => {}}
            className={`w-full py-2 bg-brandYellow hover:bg-hoverColor rounded-md transition-all duration-300 ${
              isJiggling ? "animate-shake" : ""
            }`}
            type="submit"
          >
            Reset My Password
          </button>
        </form>
        <div className="text-center mt-6">
          <Link
            to="/signin"
            className="text-brandYellow hover:underline font-medium"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword