import {useLocation,useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faLaptopMedical } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar'
import axios from 'axios'
import Swal from 'sweetalert2'

const MoreDetail=()=>{
    const navigate=useNavigate()
    const location=useLocation()
    const _id=location.state || {}
    const [doc,setDoc] =useState([])
    const[date,setDate]=useState('')
    const[appointment,setAppointment]=useState('')
    const[slot,setSlot]=useState([])

const getAppointment=async()=>{  
       let data = { date, appointment, _id };
        console.log("slot",appointment)
        const res= await axios.post('https://clinicq-backend.onrender.com/api/v1/queues/appointment',data, {withCredentials:true})
        console.log(res)
            Swal.fire({
                title: 'Appointment is made successfully',
                text: `The time is ${appointment} on ${date}`,
                icon: 'success',
                confirmButtonColor: '#3674B5', 
                background: '#EEEEEE',
                color: '#121063' 
                })
                .then(()=>{
                  navigate('/patientList')
                })
}
    
useEffect(()=>{
    const getSlot=async()=>{
        const res= await axios.post('https://clinicq-backend.onrender.com/api/v1/queues/makeAppointmentList',_id, {withCredentials:true})
        console.log(res)
        let onlyDate=date
        onlyDate=parseInt(onlyDate.split('-')[2])
        setSlot([]);  
        let i = 0;
        const matched = [];

        while (i < res.data.data.arr.length && res.data.data.arr[i].key <= onlyDate) {
            if (res.data.data.arr[i].key == onlyDate) {
                matched.push(res.data.data.arr[i].value);
            }
        i++;
        }
setSlot(matched);
        }
        getSlot()
},[date])
console.log('slot',slot)

useEffect(()=>{
    const getDoctorDetail=async()=>{
    console.log("id is this",_id)
    try{
        const res=await axios.post('https://clinicq-backend.onrender.com/api/v1/queues/doctorDetail', _id, {withCredentials:true})
        setDoc(res.data.data) 
    }
    catch(error){
        console.log('error in getting patient details', error)
    }
    }
    getDoctorDetail()
    },[])
    console.log(doc[0])
   
    const getMinDate = new Date();
    getMinDate.setDate(getMinDate.getDate() + 1);
    const minDate = getMinDate.toISOString().split('T')[0];
   const getMaxDate = new Date();
    getMaxDate.setDate(getMaxDate.getDate() + 7);
    const maxDate = getMaxDate.toISOString().split('T')[0];

    
    return (
        <>
        <Navbar/>
        <div className='grid grid-cols-2 '>             
            <div className='py-3 flex text-check2 text-3xl justify-center items-center font-serif  bg-check1  '>
                 <FontAwesomeIcon icon={faLaptopMedical}className="text-check2 ml-3 pr-2 text-3xl hover:text-sky-950 transition duration-300"/>
                <h1> Plan Your Visit</h1> 
            </div>
            <div className='py-3 flex text-check1 text-3xl justify-center items-center font-serif  bg-check2 '>
                <FontAwesomeIcon icon={faLaptopMedical}className="text-check1 ml-3 text-3xl hover:text-sky-950 pr-2 transition duration-300"/>
                 <h1>Meet Your Doctor</h1>
            </div>
        </div>
       
        
        <div className='grid grid-cols-2 min-h-screen text-serif'>
            <div className='bg-check2 pl-4  '>
                <h1 className='font-bold text-xl text-brown'> Clinic Location Details</h1>
                <div className="">
                    <iframe
                        src={`https://www.google.com/maps?q=${doc[0]?.userInfo.location.coordinates[0]},${doc[0]?.userInfo.location.coordinates[1]}&z=15&output=embed`}
                        width="60%"
                        height="100%"
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                    </div>
                <h1 className='font-bold text-xl mt-4 text-brown'>Contact Information</h1>
                <h1 className='text-darkblue text-base'>Phone number: {doc[0]?.userInfo?.phoneNumber}</h1>
                <h1 className='text-darkblue text-base'>{doc[0]?.userInfo?.email}</h1>
                <h1 className='font-bold text-xl mt-4 text-brown'>Clinic timing</h1>
                <h1 className='text-darkblue text-base'>Timing: {doc[0]?.timing.working.start} - {doc[0]?.timing.working.end}</h1>
                <h1 className='text-darkblue text-base'>break: {doc[0]?.timing.break.start} - {doc[0]?.timing.break.end}</h1>
                <h1 className='font-bold text-xl mt-4 text-brown'>Important to note</h1>
                <p className='text-darkblue text-base'>✔️You can book an appointment slot of 1hr </p>
                <p className='text-darkblue text-base'>✔️Please bring your previous reports </p>
                <p className='text-darkblue text-base'>✔️Come 10 mins before appointment</p>
                <h1 className='font-bold text-xl my-4 text-brown'>Book an appointment</h1>
                <input className="text-darkblue border-2 mt-1 mr-3"  type='date' name='date' value={date} onChange={(e)=>setDate(e.target.value)} min={minDate} max={maxDate}/>
               <select className='bg-white text-darkblue border-2  mt-1' name='appointment' value={appointment} onChange={(e)=>setAppointment(e.target.value)}>
                    <option value=''>Select your slot</option>
                  {slot.map((time, index)=>(
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
                <div className=' min-w-xs'>
                    <button onClick={getAppointment} className=" px-2 bg-check1 text-check2 p-1 mt-3 rounded border-2">Confirm appointment</button>
               </div>
               
            </div>
            <div className='flex font-serif flex-col p-9 bg-check1 text-white items-center'>
                 <img src={doc[0]?.userInfo?.photo} className='h-[200px] w-[200px] rounded-xs'  ></img>
                 <h1 className=' py-2 text-xl text-yellow'>Dr. {doc[0]?.userInfo?.fullName},  {doc[0]?.degree.toUpperCase()}  ({doc[0]?.specialization})</h1>
                <p className="text-md pb-2 text-check2 mb-1">Experience: {doc[0]?.experience}+ years</p>
                <p className="text-md pb-2 text-check2 mb-1">Clinic: {doc[0]?.clinicName}</p>
                <p className="text-md pb-2 text-check2 mb-1">Timings: {doc[0]?.timing.working.start} - {doc[0]?.timing.working.end}</p>
                <p className="text-md pb-2 text-check2 mb-1">Working Days: {doc[0]?.workingDays[0]}- {doc[0]?.workingDays[doc[0]?.workingDays.length-1]}</p>
                <p className="text-md pb-2 text-check2">Email: {doc[0]?.userInfo?.email}</p>
            </div>
        </div>
        </>
    )
}

export default MoreDetail
