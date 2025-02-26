import { supabase } from "@/data/supabaseclient"
import { useUserStore } from "@/data/userstore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


const ChangePasswordPage = () => {
    const [newPassword, SetNewPassword] = useState<string>("")
    const [validToken, setValidToken] = useState<boolean>(false)
    const [token, setToken] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState<string>("")
    const signOut = useUserStore((state) => state.signOut)
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
            signOut()
        }
    }, [signOut])


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
        <div className="w-full max-w-md p-6  bg-backgroud rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground mb-2">Reset Password</h1>
                <p className="text-gray-600 mb-4">Please enter your new password</p>
            </div>

            <div>
                <input type="text" placeholder="New Password" onChange={(e) => SetNewPassword(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"/>
                <button onClick={handleSubmit}>Reset Password</button>
            </div>

        </div> : 
            <p>Invaid or Expired Token</p> }
    </div>
  )

}

export default ChangePasswordPage