import {useState,useEffect} from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import {useNavigate} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faLaptopMedical } from '@fortawesome/free-solid-svg-icons';

const PatientHomepage=()=>{
    const user=JSON.parse(localStorage.getItem('user'))
    const [arrayOfQueue,setArrayOfQueue]=useState([])
    const navigate=useNavigate()
    const [phoneNumber, setPhoneNumber]=useState('')
    const[showPhoneNumber, setShowPhoneNumber]=useState(null)

    const handleChange=(e)=>{
        setPhoneNumber(
            e.target.value
        )
        
}


    const getPatientInQueue=async()=>{
        setShowPhoneNumber(true)
        const res=await axios.post('https://clinicq-backend.onrender.com/api/v1/queues/patientDetail',{phoneNumber},{withCredentials:true})
        console.log(res)
        setPhoneNumber('')
    }

    useEffect(()=>{
        const fetchQueue=async()=>{
             try{
            const res= await axios.post('https://clinicq-backend.onrender.com/api/v1/queues/doctorsList',{},{withCredentials:true})
            setArrayOfQueue(res.data.data)
             
        }
            catch(error){
                console.log('error in fetching list of queue', error)
        }
        }
       fetchQueue()
    },[])
       
    const Logout=async()=>{
        try{
            const res = await axios.post('https://clinicq-backend.onrender.com/api/v1/users/logout',{},{ withCredentials: true })
            localStorage.clear();
            navigate('/login')
            console.log(res)
        }
        catch(error){
            console.log('error in logout',error)
        }
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
     console.log('LAT1:', lat1, 'LON1:', lon1, 'LAT2:', lat2, 'LON2:', lon2);

    const R = 6371; 
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 

    return distance;
    }



    return(
        <>
        <div className='bg-sky-200 min-h-screen'>
        <div className='flex flex-row justify-between items-center bg-sky-200  border-1  border-gray-400'>
                    <div className='flex  items-center '>
                        <FontAwesomeIcon icon={faLaptopMedical}className="text-darkblue ml-3 text-3xl hover:text-sky-950 transition duration-300"/>
                        <h1 className=' font-serif text-darkblue text-3xl font-bold'>ClinicQ</h1>
                    </div>
                    <div className=' flex  items-center '>
                         <button className='rounded-sm mx-2 bg-red-900 text-white text-base border-2 h-9  px-4' onClick={Logout}>Logout</button>
                         <img src={user.photo} className=' w-10 h-10 my-1 mx-2 rounded-full ' ></img>
                    </div>        
        </div>
        <div className=" flex flex-col font-serif pt-5 items-center text-darkblue bg-sky-200">
        <h1 className='text-3xl font-bold p-3'>Welcome {user.fullName.charAt(0).toUpperCase() + user.fullName.slice(1)} </h1>
        <p>Hope you are feeling well today !!</p>  
        </div>
         <div className=" flex flex-wrap font-serif justify-center text-base pt-5  bg-sky-200">
          {
            arrayOfQueue.map((items) => {
                const distance = items.userInfo?.location?.coordinates
                ? calculateDistance(
                    user.location.coordinates[0].toFixed(3),
                    user.location.coordinates[1].toFixed(3),
                    items.userInfo.location.coordinates[0].toFixed(3),
                    items.userInfo.location.coordinates[1].toFixed(3)
                    )
                : 'Unknown';

                return (
                <div className="flex flex-col bg-beige p-3 rounded-md m-2 min-w-2xs" key={items._id}>
                    <div className="text-white mx-3">
                    <h1 className="text-yellow">
                        Dr. {items.userInfo?.fullName}, {items.degree?.toUpperCase()} ({items.specialization})
                    </h1>
                    <h1>Experience: {items.experience}+ years of experience</h1>
                    <h1>Distance: {distance.toFixed(2)} km away</h1>
                    </div>

                    <div className="flex mt-2 flex-row justify-center">
                    <button
                        onClick={() => {
                        navigate(`/doctor/${items._id}`, { state: { _id: items._id } });
                        }}
                        className="bg-gold mx-2 px-2 min-w-3xs rounded-xs"
                    >
                        More details
                    </button>
                    </div>

                    {showPhoneNumber === items._id && (
                    <div className="flex mt-2 flex-row justify-center">
                        <input
                        type="text"
                        placeholder="Enter your phone number"
                        name="phoneNumber"
                        className="px-2 py-1 w-full m-1 rounded border-2"
                        value={phoneNumber}
                        onChange={handleChange}
                        autoComplete="tel"
                        />
                        <button
                        onClick={getPatientInQueue}
                        className="bg-sky-200 mx-2 px-2 py-1 rounded-xs m-2"
                        >
                        Enter
                        </button>
                    </div>
                    )}
                </div>
                );
            })
            }

        </div>
         
</div>
       
        </>
    )
}
export default PatientHomepage