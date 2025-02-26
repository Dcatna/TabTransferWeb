import { supabase } from "@/data/supabaseclient"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const ChangePasswordPage = () => {
    const [newPassword, SetNewPassword] = useState<string>("")
    const [validToken, setValidToken] = useState<boolean>(false)
    const [token, setToken] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState<string>("")

    const navigator = useNavigate()

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Removes "#"
        const accessToken = hashParams.get("access_token");
        console.log(accessToken)
        if (!accessToken) {
            setErrorMsg("Invalid token or Expired Link")
            
        } else {
            setToken(accessToken)
            setValidToken(true)
        }
    }, [])


    async function handleSubmit() {
        const {error} = await supabase.auth.updateUser({password: newPassword})
        if (error) {
            setErrorMsg("Failed to update password")
        } else {
            alert("Password Reset Successfully")
            navigator("/signin")
        }
    }

  return (

    <div className=" w-full flex flex-col items-center justify-center">
         {errorMsg && <p>{errorMsg}</p>}
        { validToken && token ? 
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-brandYellow mb-2">Sign In!</h1>
                <p className="text-gray-600 mb-4">Please enter your new password</p>
            </div>

            <div>
                <input type="text" placeholder="New Password" onChange={(e) => SetNewPassword(e.target.value)}/>
                <button onClick={handleSubmit}>Reset Password</button>
            </div>

        </div> : 
            <p>Invaid or Expired Token</p> }
    </div>
  )

}

export default ChangePasswordPage