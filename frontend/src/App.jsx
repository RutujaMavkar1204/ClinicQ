import react from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Homepage from './components/Homepage.jsx'
import Registration from './components/Registration.jsx'
import Login from './components/Login.jsx'
import PatientHomepage from './components/Patient.Homepage.jsx'
import DoctorHomepage from './components/Doctor.Homepage.jsx'
import MoreDetail from './components/MoreDetail.jsx'
import ProtectedRoute from './utils/ProtectedRoute.jsx'
import AuthDirectRoute from './utils/AuthDirectRoute.jsx'

function App() {


  return (
    <>
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<AuthDirectRoute/>}/>
      <Route path='/homepage' element={<Homepage/>}/>
      <Route path='/register' element={<Registration/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/patientList' element={<ProtectedRoute allowedRole='Patient'> <PatientHomepage/></ProtectedRoute>}/>
      <Route path='/doctor/:id' element={<ProtectedRoute allowedRole='Patient'> <MoreDetail/></ProtectedRoute>}/>
      <Route path='/queuesList' element={<ProtectedRoute allowedRole='Doctor'> <DoctorHomepage/></ProtectedRoute>}/>
    </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
