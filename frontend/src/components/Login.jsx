import {NavLink,useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import {useState} from 'react'
const Login=()=>{
    const [formdata, setFormdata]=useState({
        email:'',
        password:''
    })
 const Navigate=useNavigate()    

    const handleChange=(e)=>{
        setFormdata({
            ...formdata,
            [e.target.name]:e.target.value
        })
    }

    const submit=async(e)=>{
        try{
        e.preventDefault()
        const body={
            password:formdata.password
        }
           body.email=formdata.email
      
            const res=await axios.post('https://clinicq-backend.onrender.com/api/v1/users/login',body,{
                withCredentials: true
            })
            console.log(res)
            Swal.fire({
                         title: 'Login Successful 🎉',
                         text: 'Welcome to ClinicQ!',
                         icon: 'success',
                         confirmButtonColor: '#3674B5', 
                         background: '#EEEEEE',
                         color: '#121063' 
            
                         }).then(()=>{
                            const role=res.data.data.user.role
                            const accessToken=res.data.data.accessToken
                            const user=res.data.data.user
                            localStorage.setItem('role',role)
                            localStorage.setItem('accessToken',accessToken)
                            localStorage.setItem('user',JSON.stringify(user))

                            
                            if(role=='Doctor'){
                               Navigate('/queuesList',{ replace: true })
                            }
                            else if(role=='Patient'){
                                Navigate('/patientList', { replace: true })
                            }
                            else{
                                Swal.fire({
                                title:'Unauthorized error',
                                text:'Define role properly',
                                icon:'error',
                                confirmButtonColor: '#F7374F', 
                                background: '#CB0404',
                                color: '#fff' 
                        
            })
                            }
                         })
        }
        catch(error){
             if(formdata.email.trim()=='' ||formdata.password.trim()==''){
                            Swal.fire({
                                title: 'All fields are compulsary',
                                text: 'Check what is missing and try again ',
                                icon:'error',
                                confirmButtonColor: '#F7374F', 
                                background: '#CB0404',
                                color: '#fff' 
                    
                                 })
                        }      
            else{
                 Swal.fire({
                title:'Login Failed!',
                text:'please Register',
                icon:'error',
                confirmButtonColor: '#F7374F', 
                background: '#CB0404',
                color: '#fff' 
                        
            })
            }
           setFormdata({ email:'',
        password:''})
            console.log('error in login:',error)
        }


    }
    return(
        <>
        <div className=' min-h-screen flex bg-sky-200 items-center justify-center '>
         <form onSubmit={submit} className='flex flex-col items-center justify-center ' >
            <h1 className='text-3xl font-bold p-3 font-serif text-darkblue'>ClinicQ</h1>
            <div>
                <input className=" px-2 py-1 min-w-3xs m-1 rounded border-2" name="email" autocomplete="email" type="text" placeholder='enter your email' value={formdata.email} onChange={handleChange} />
            </div>
            <div>
                <input name="password" className=" px-2 py-1 min-w-3xs m-1 rounded border-2" type="text" placeholder='enter password' autocomplete="current-password" value={formdata.password} onChange={handleChange} />
            </div>
             <div>
                <button type='submit' className=" px-2 bg-gold py-1 min-w-3xs m-1 rounded border-2" >Login</button>
            </div>
            <div className=' flex min-w-3xs justify-center'>
                            <h3 >Does'nt have an Account?  
                            <NavLink to='/register'>
                            <button className='p-1 hover:underline text-darkblue' >Register</button>
                            </NavLink></h3>
                        </div>
            </form>
             </div>
        </>
    )
}
export default Login