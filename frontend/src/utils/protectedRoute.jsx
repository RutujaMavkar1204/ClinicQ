import {useNavigate} from 'react-router-dom'


const ProtectedRoute=({children,allowedRole})=>{
    const token = localStorage.getItem('accessToken')
    const role= localStorage.getItem('role')

    const Navigate=useNavigate()
    if (!token) {
    return <Navigate to="/register" replace />;
  }

  if (!role || allowedRole !== role) {
    return <Navigate to="/register" replace />;
  }
    return children
}
export default ProtectedRoute