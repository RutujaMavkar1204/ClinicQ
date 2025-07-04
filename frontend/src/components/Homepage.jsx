import react from 'react'
import {useState} from 'react'
import {NavLink} from 'react-router-dom'

const Homepage=()=>{
    return (
<>
<div className=" flex flex-col font-serif pt-5 items-center min-h-screen text-darkblue bg-sky-200">
<h1 className='text-3xl font-bold p-3'>ClinicQ - A Virtual Queue</h1>
<h3 className='text-xl pb-3'>Because your time matters.</h3>
<NavLink to='/register'><button className='border-3  bg-gold rounded-sm p-1'>Create Account</button></NavLink>

</div>
 
</>
    )
}
export default Homepage
