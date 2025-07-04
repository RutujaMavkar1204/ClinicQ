import {useNavigate} from 'react-router-dom'
import {useEffect} from 'react'


const AuthDirectRoute=()=>{
    const navigate=useNavigate()
    useEffect(()=>{
const role=localStorage.getItem('role')
    if(role=='Doctor'){
        navigate('/queuesList')
    }
    else if(role=='Patient'){
         navigate('/patientList')
    }
    else{
        navigate('/homepage')
    }
    },[])
    return null
    
}
export default AuthDirectRoute