import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const DoctorHomepage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [showForm, setShowForm] = useState(false);
  const [isClinicPresent, setIsClinicPresent] = useState(false);
  const [date, setDate] = useState('');
  const [dates, setDates] = useState([]);
  const [arrayOfQueue, setArrayOfQueue] = useState([]);
  const [formdata, setFormdata] = useState({
    clinicName: '',
    specialization: '',
    degree: '',
    experience: '',
    workingStart: '',
    workingEnd: '',
    breakStart: '',
    breakEnd: '',
    workingDays: ''
  });

  // Generate dates for select dropdown
  useEffect(() => {
    const arrOfDates = [];
    for (let i = 0; i <= 7; i++) {
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + i);
      const getMaxDate = maxDate.toISOString().split('T')[0];
      arrOfDates.push(getMaxDate);
    }
    setDates(arrOfDates);
  }, []);

  // Fetch clinic info and initial queue
  useEffect(() => {
    const getClinic = async () => {
      try {
        const res = await axios.post('https://clinicq-backend.onrender.com/api/v1/queues/existedClinic', {}, { withCredentials: true });
        setIsClinicPresent(res.data.data);

        if (!date) {
          await fetchQueue();
        }
      } catch (err) {
        console.log("Error fetching clinic:", err);
      }
    };

    getClinic();
  }, []);

  // Fetch full queue
  const fetchQueue = async () => {
    try {
      const res = await axios.post('https://clinicq-backend.onrender.com/api/v1/queues/getAllAppointments', { _id: user._id }, { withCredentials: true });
      setArrayOfQueue(res.data.data);
      console.log("Fetched full queue:", res.data.data);
    } catch (err) {
      console.log("Error fetching full queue:", err);
    }
  };

  // Fetch particular date appointment only if date is selected
  useEffect(() => {
    if (!date) return;

    const fetchParticularDate = async () => {
      try {
        const res = await axios.post('https://clinicq-backend.onrender.com/api/v1/queues/particularDateAppointment', { date }, { withCredentials: true });
        setArrayOfQueue(res.data.data);
        console.log("Fetched particular date queue:", res.data.data);
      } catch (err) {
        console.log("Error fetching particular date queue:", err);
      }
    };

    fetchParticularDate();
  }, [date]);

  // Show form if no clinic present
  useEffect(() => {
    setShowForm(!isClinicPresent);
  }, [isClinicPresent]);

  const TodaysAppointment = async () => {
    try {
      const res = await axios.post('https://clinicq-backend.onrender.com/api/v1/queues/getTodaysAppointment', {}, { withCredentials: true });
      setArrayOfQueue(res.data.data);
      console.log("Today's appointments:", res.data.data);
    } catch (err) {
      console.log("Error fetching today's appointments:", err);
    }
  };

  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (formdata.clinicName.trim() === '' || formdata.specialization.trim() === '') {
      Swal.fire({
        title: 'All fields are compulsory',
        text: 'Check what is missing and try again',
        icon: 'error',
        confirmButtonColor: '#F7374F',
        background: '#CB0404',
        color: '#fff'
      });
      return;
    }

    try {
      const res = await axios.post('https://clinicq-backend.onrender.com/api/v1/queues/queueCreatedByDoctor', {formdata}, { withCredentials: true });
      console.log("Queue creation response:", res.data);

      Swal.fire({
        title: 'Queue created successfully',
        text: 'You can manage the queue now',
        icon: 'success',
        confirmButtonColor: '#3674B5',
        background: '#EEEEEE',
        color: '#121063'
      }).then(() => {
        setShowForm(false);
      });
    } catch (err) {
      console.log("Error creating queue:", err);
      Swal.fire({
        title: 'Something went wrong',
        text: 'Please try again',
        icon: 'error',
        confirmButtonColor: '#F7374F',
        background: '#CB0404',
        color: '#fff'
      });
    }
  };

  const options = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' }
  ];

  return (
    <>
      <Navbar />
      <div className="flex flex-col font-serif pt-5 items-center text-darkblue bg-sky-200">
        <h1 className="text-3xl font-bold p-3">
          Welcome Dr. {user.fullName.charAt(0).toUpperCase() + user.fullName.slice(1)}
        </h1>

        <div className="flex justify-center font-serif items-center">
          <button onClick={TodaysAppointment} className="bg-gold py-1 px-4 m-3 rounded border-2">
            See today's appointments
          </button>
          <select
            className="bg-gold py-1 px-4 m-3 rounded border-2"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          >
            <option value="">Select a Date</option>
            {dates.map((d, index) => (
              <option key={index} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {showForm && (
          <form onSubmit={submit} className="max-w-md">
            <input name="clinicName" className="px-2 py-1 w-full m-1 rounded border-2" type="text" placeholder="Enter your Clinic name" value={formdata.clinicName} onChange={handleChange} />
            <input name="degree" className="px-2 py-1 w-full m-1 rounded border-2" type="text" placeholder="Enter your degree" value={formdata.degree} onChange={handleChange} />
            <input name="experience" className="px-2 py-1 w-full m-1 rounded border-2" type="number" placeholder="Enter how many years of experience you have" value={formdata.experience} onChange={handleChange} />
            <input name="specialization" className="px-2 py-1 w-full m-1 rounded border-2" type="text" placeholder="Enter your specialization field" value={formdata.specialization} onChange={handleChange} />
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

            <Select
              className="w-full m-1 rounded border-2"
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
            <button type="submit" className="px-2 bg-gold py-1 w-full m-1 rounded border-2">
              Enter
            </button>
          </form>
        )}
      </div>

      <div className="flex flex-row justify-center items-center">
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
      </div>
    </>
  );
};

export default DoctorHomepage;
