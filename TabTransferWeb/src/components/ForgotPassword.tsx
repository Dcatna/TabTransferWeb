
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from '@/data/supabaseclient';
import { Card } from './ui/card';
import { Button } from './ui/button';

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
        const res = await supabase.auth.resetPasswordForEmail(formData.email, {redirectTo: "https://tabtransfer.org/resetpassword"})
        console.log(res)
        if (res.error) {
            alert("Error Resetting Password")

        } else{
            navigator("/signin")
        }
    }


  return (

    <div className=" w-full flex flex-col items-center justify-center">
      <Card className="w-full max-w-md p-6  bg-backgroud rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Reset Password</h1>
          <p className=" mb-4">Please enter your email</p>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Email"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              {...register("email")}
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>
          <Button
            onClick={ errors.email ? handleButtonClick : () => {}}
            className={`w-full py-2 rounded-md transition-all duration-300 ${
              isJiggling ? "animate-shake" : ""
            }`}
            type="submit"
          >
            Reset My Password
          </Button>
        </form>
        <div className="text-center mt-6">
          <Link
            to="/signin"
            className="text-foreground hover:underline font-medium"
          >
            Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default ForgotPassword