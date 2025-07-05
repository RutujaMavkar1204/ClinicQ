import {useState, useEffect} from 'react'
import axios from 'axios'
import Swal from 'sweetalert2';
import {NavLink, useNavigate} from 'react-router-dom'
import Login from './Login.jsx'

const Registration=()=>{
 const [latitude,setLatitude]=useState('')
 const [longitude,setLongitude]=useState('')
 const Navigate=useNavigate()
const[formdata,setFormdata]=useState({
    email:'',
    fullName:'',
    password:'',
    role:'',
    photo:'',
    phoneNumber:''
    
})

useEffect(()=>{
    const Geolocation=()=>{
        if('geolocation' in navigator){
            navigator.geolocation.getCurrentPosition(
                (position)=>{
                    setLatitude(position.coords.latitude)
                    setLongitude(position.coords.longitude)
                }
            )
        }
        else{
            console.log('error in getting')
        }

 }
 Geolocation()
 },[])

    
const submit=async(e)=>{
    e.preventDefault()
    const data=new FormData()
    for(let key in formdata){
        data.append(key,formdata[key])
    }
    try{
        const res=await axios.post('https://clinicq-backend.onrender.com/api/v1/users/register',data,{
            headers:{
                'Content-Type':'multipart/form-data',
                'latitude': latitude,
                'longitude': longitude
            }
        })
        Swal.fire({
             title: 'Registration Successful 🎉',
             text: 'Welcome to ClinicQ!',
             icon: 'success',
             confirmButtonColor: '#3674B5', 
             background: '#EEEEEE',
             color: '#121063' 
             })
        .then(()=>{
               Navigate('/login',{ replace: true })
             });
    }
    catch(error){
       
            Swal.fire({
                title: 'All fields are compulsary',
                text: error.response?.data?.message || 'Something went wrong. Please try again.',
                icon:'error',
                confirmButtonColor: '#F7374F', 
                background: '#CB0404',
                color: '#fff' 
    
            }).then(()=>{
                     setFormdata({  email:'',
                                    fullName:'',
                                    password:'',
                                    role:'',
                                    photo:''})
                    })
        
    }
   }

const handleChange=(e)=>{
    setFormdata({
        ...formdata,
        [e.target.name]:e.target.value
    })
}

const handleImageChange=(e)=>{
    setFormdata({
      ...formdata,
      photo:e.target.files[0]
    })
}

    return(
        <>
        <div className='min-h-screen z-10 bg-sky-200 flex flex-col justify-center items-center '>
            <h1 className='text-3xl font-bold p-3 font-serif text-darkblue'>Welcome to ClinicQ</h1>
        <form onSubmit={submit} className=' max-w-md ' >
            <div>
                <input className=" px-2 py-1 w-full m-1 rounded border-2" autocomplete="fullName"  name="fullName" type="text" placeholder='Enter your fullname' value={formdata.fullName} onChange={handleChange} />
            </div>
            <div>
                <input name="password" className=" px-2 py-1 w-full m-1 rounded border-2" type="password" autocomplete="password"  placeholder='Enter password'  value={formdata.password} onChange={handleChange} />
            </div>
            <div>
                <input name="email" className=" px-2 py-1 w-full m-1 rounded border-2" type="email" autocomplete="emmail"  placeholder='Enter your email' value={formdata.email} onChange={handleChange} />
            </div>
            <div>
                <input name="phoneNumber" className=" px-2 py-1 w-full m-1 rounded border-2" type="number" placeholder='Enter your Phone number' value={formdata.phoneNumber} onChange={handleChange} />
            </div>
            <div>
                <select name="role" className=" px-2 py-1 w-full bg-white m-1 rounded border-2"  value={formdata.role} onChange={handleChange}>
                    <option value=''>Select a Role</option>
                    <option value='Doctor'>Doctor</option>
                    <option value='Patient'>Patient</option>
                </select>
            </div>
            <div className="px-2 py-1 bg-white w-full m-1 rounded border-2 cursor-pointer">
                <label htmlFor="photo-upload" className='cursor-pointer' >Upload Photo</label>
                <input type="file" name="photo" accept="image/*"  id="photo-upload" className=" hidden" onChange={handleImageChange}/>
                </div>  
            <div>
                <button type='submit' className=" px-2 bg-gold py-1 w-full m-1 rounded border-2" >Register</button>
            </div>
            <div className=' flex justify-center'>
                <h3 >Already have an Account?  
                <NavLink to='/login'>
                <button className='p-1 hover:underline text-darkblue' >Login</button>
                </NavLink></h3>
            </div>
        </form>
        </div>
        
       
        </>
    )
}
export default Registration