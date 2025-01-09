
import { SignOut } from '../data/supabaseclient'
import { useNavigate } from 'react-router-dom'


const Home = () => {
    const navigate = useNavigate()
    function HandleClick() {
        navigate("/Signin")
        SignOut()
    }
  return (
    <div>
        <button onClick={HandleClick}>Signout</button>
        Home
    </div>
  )
}

export default Home