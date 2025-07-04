import {useState,useEffect} from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import Select from 'react-select';
import {useNavigate} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faLaptopMedical } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar'

const DoctorHomepage=()=>{
    const user=JSON.parse(localStorage.getItem('user'))
    const [showForm ,setShowForm]=useState(false)
    const [isClinicPresent,setIsClinicPresent]=useState(false)
     const[date,setDate]=useState('')
    const[dates,setDates]=useState([])
      const [arrayOfQueue,setArrayOfQueue]=useState([])
    const [formdata, setFormdata]=useState({
        clinicName:'', specialization:'',degree:'', experience:'', workingStart:'',workingEnd:'',breakStart:'',breakEnd:'', workingDays:''
    })

    
useEffect(()=>{
    const getClinic=async()=>{
        const res=await axios.post('http://localhost:4000/api/v1/queues/existedClinic',{}, { withCredentials: true })
        console.log(res.data.data)
        setIsClinicPresent(res.data.data)
        const arrOfDates=[]

    for(let i=0; i<=7; i++){
       const maxDate=new Date()
    maxDate.setDate(maxDate.getDate()+i)
    const getMaxDate=maxDate.toISOString().split('T')[0]
      arrOfDates.push(getMaxDate)
    }
     setDates(arrOfDates)
    }
    
    getClinic()
},[])

useEffect(() => {
  setShowForm(!isClinicPresent);
}, [isClinicPresent]);
console.log("showform:", showForm)
 useEffect(()=>{
        const fetchQueue=async()=>{
          const _id=user._id
             try{
            const res= await axios.post('http://localhost:4000/api/v1/queues/getAllAppointments',{_id},{withCredentials:true})
            setArrayOfQueue(res.data.data)
            console.log("this is lst of patient", res)
           
             
        }
            catch(error){
                console.log('error in fetching list of queue', error)
        }
        }
       fetchQueue()
    },[])


    
const options = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' }
];
   
   
    const handleChange=(e)=>{
        setFormdata({
            ...formdata,
            [e.target.name]:e.target.value
        }
        )
       
    }
    const submit=async(e)=>{
        e.preventDefault()
        console.log(formdata)
        try{
            const res=await axios.post('http://localhost:4000/api/v1/queues/queueCreatedByDoctor',formdata, { withCredentials: true })
            console.log(res)
             Swal.fire({
                 title: 'Queue created SucessFully',
                 text: 'You can Manage the queue now',
                 icon: 'success',
                 confirmButtonColor: '#3674B5', 
                 background: '#EEEEEE',
                 color: '#121063' 
    
                 }).then(()=>{
                    setShowForm(false)
                 })
        }
        catch(error){
             if( formdata.clinicName.trim()==''  || formdata.specialization.trim()==''  ){
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
            title: 'Something went Wrong',
            text: 'please try again ',
            icon:'error',
            confirmButtonColor: '#F7374F', 
            background: '#CB0404',
            color: '#fff' 

             })
    }
    
                        console.log('error in creating Queue:',error)
        }
    }
  
    const TodaysAppointment=async()=>{
      const res=await axios.post('http://localhost:4000/api/v1/queues/getTodaysAppointment',{},{withCredentials:true})
      console.log(res)
      setArrayOfQueue(res.data.data)
    }
    useEffect(()=>{
      const particularDateAppointment=async()=>{

        const res=await axios.post('http://localhost:4000/api/v1/queues/particularDateAppointment',{date},{withCredentials:true})
        console.log(res)
        setArrayOfQueue(res.data.data)
       

    }
    particularDateAppointment()
    },[date])
    
    


    return(
        <>
        <Navbar/>
        <div className=" flex flex-col font-serif pt-5 items-center text-darkblue bg-sky-200">
          <h1 className='text-3xl font-bold p-3'>Welcome Dr. {user.fullName.charAt(0).toUpperCase() + user.fullName.slice(1)}</h1>
          <div className='flex justify-center font-serif items-center'>
            <button onClick={TodaysAppointment}className='  bg-gold py-1 px-4 m-3 rounded border-2'>See today's appointments</button>
             <select className=' bg-gold py-1 px-4 m-3 rounded border-2' name='date' value={date} onChange={(e)=>setDate(e.target.value)}>
                    <option value=''>Select a Date</option>
                  {dates.map((date, index)=>(
                    <option key={index} value={date}>{date}</option>
                  ))}
                </select>
          </div>
            
         {showForm &&
            <>
            <div>
                <form onSubmit={submit} className=' max-w-md ' >
            <div>
                <input name="clinicName"className=" px-2 py-1 w-full m-1 rounded border-2" type="text" placeholder='Enter your Clinic name' value={formdata.clinicName} onChange={handleChange} />
            </div>
            <div>
                <input name="degree" className=" px-2 py-1 w-full m-1 rounded border-2" type="text" placeholder='Enter your degree'  value={formdata.degree} onChange={handleChange} />
            </div>
            <div>
                <input name="experience" className=" px-2 py-1 w-full m-1 rounded border-2" type="Number" placeholder='Enter how many years of experience you have' value={formdata.experience} onChange={handleChange} />
            </div>
             <div>
                <input name="specialization" className=" px-2 py-1 w-full m-1 rounded border-2" type="text" placeholder='Enter your specialization field' value={formdata.specialization} onChange={handleChange} />
            </div>
            <div className=''>
                <div className='flex pl-2 py-1 relative items-center '>
                     <label htmlFor="workingStart" className="text-base text-serif px-1 text-center text-gray-600">Enter the opening time of clinic </label>
                     <input type="time" className='pl-3 py-1 w-[100px]  rounded border-2 absolute inset-y-0 right-0' name="workingStart" value={formdata.workingStart} onChange={handleChange} />
                       </div>
                <div className='flex  pl-2 py-1 relative items-center '>
                     <label htmlFor="workingStart" className="text-base text-serif px-1 text-center text-gray-600">Enter the closing time of clinic </label>
                     <input type="time" className='pl-3 py-1 w-[100px]  rounded border-2 absolute inset-y-0 right-0' name="workingEnd" value={formdata.workingEnd} onChange={handleChange}/>
                </div>
                <div className='flex  pl-2 py-1 relative items-center '>
                     <label htmlFor="workingStart" className="text-base text-serif px-1 text-center text-gray-600">Enter the break time of clinic </label>
                     <input type="time" className='pl-3 py-1 w-[100px] rounded border-2 absolute inset-y-0 right-0' name="breakStart" value={formdata.breakStart} onChange={handleChange}/>
                </div>
                <div className='flex  pl-2 py-1  items-center '>
                     <label htmlFor="workingStart" className="text-base text-serif px-1 text-center text-gray-600">Enter the end time break of clinic </label>
                     <input type="time" className='pl-3 py-1 w-[100px]  rounded border-2 ' name="breakEnd" value={formdata.breakEnd} onChange={handleChange}/>
                </div>
               
                  </div>  
            <div>
               <Select className=' w-full m-1 rounded border-2'
                  isMulti
                   closeMenuOnSelect={false}
                  options={options}
                  value={options.filter(opt => formdata.workingDays.includes(opt.value))}
                  onChange={(selectedOptions) => {
                    setFormdata({
                      ...formdata,
                      workingDays: selectedOptions.map(opt => opt.value)
                    });
                  }}
                />
            </div>
            <div>
                <button type='submit' className=" px-2 bg-gold py-1 w-full m-1 rounded border-2" >Enter</button>
            </div>
        </form>
            </div>
            </> 
            }
        </div>
        <div className='flex flex-row  justify-center items-center'>
                <>
<table className="min-w-md mb-5 bg-white rounded-lg shadow-md overflow-hidden">
  <thead className="bg-darkblue text-white">
    <tr>
      <th className="py-3 px-4 border-2 border-black text-left">Name</th>
      <th className="py-3 px-4 border-2 border-black text-left">Date</th>
      <th className="py-3 px-4 border-2 border-black text-left">Appointment Time</th>
    </tr>
  </thead>
  <tbody>
    {arrayOfQueue.map((items) => (
      <tr key={items._id} className="border-b hover:bg-gray-100 transition">
        <td className="py-2 border-2 px-4">{items.patientName}</td>
        <td className="py-2 border-2 px-4">{items.date}</td>
        <td className="py-2 border-2 px-4">{items.appointment}</td>
      </tr>
    ))}
  </tbody>
</table>
                </>
               
        </div>
        </>
    )
}
export default DoctorHomepage