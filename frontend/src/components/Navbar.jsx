import {useNavigate} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faLaptopMedical } from '@fortawesome/free-solid-svg-icons';
import {useState} from 'react'
import axios from 'axios'

const Navbar=()=>{
    const user=JSON.parse(localStorage.getItem('user'))

     const navigate=useNavigate()
    const Logout=async()=>{
        try{
            const res=await axios.post('http://localhost:4000/api/v1/users/logout',{},{ withCredentials: true })
            localStorage.clear();
            navigate('/login')
            console.log(res)
        }catch(error){
            console.log('error in logout',error)
        }
    }
    return(
        <>
         <div className='flex  items-center bg-sky-200 pt-12 border-1  relative border-gray-400'>
            <div className='absolute flex  items-center inset-y-0 left-0'>
                <FontAwesomeIcon icon={faLaptopMedical}className="text-darkblue ml-3 text-3xl hover:text-sky-950 transition duration-300"/>
                <h1 className=' font-serif text-darkblue text-3xl font-bold'>ClinicQ</h1>
            </div>
            <div className='absolute flex  items-center inset-y-0 right-0'>
               
                 <button className='rounded-sm mx-2 bg-red-900 text-white text-base border-2 h-9  px-4' onClick={Logout}>Logout</button>
                 <img src={user.photo} className=' w-10 h-10 my-1 mx-2 rounded-full ' ></img>
            </div>        
        </div>
        </>
    )
}
export default Navbar