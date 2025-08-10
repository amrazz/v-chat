import { toast } from 'react-toastify'
import { removeLogin } from '../store/slice'
import useApi from '../useApi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const api = useApi()
  const { refresh_token } = useSelector((state) => state.auth)
  const handleLogout = async () => {
    try {
      const response = await api.post("users/logout/", { refresh: refresh_token });
      if (response.status === 205) {
        console.log(`I am loggin out....`)
        dispatch(removeLogin());
        toast.success("Logged out successfully");
        navigate("/")
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return handleLogout
}
export default useLogout
