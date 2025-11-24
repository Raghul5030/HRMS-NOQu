import './App.css'
import { Link } from 'react-router-dom'
import { Dashboard } from './pages/dashboard/dashboard.jsx'
import { Route, Routes } from 'react-router-dom'
import {Onboarding} from './pages/onboarding/onboarding.jsx'
import { Employees } from './pages/employe/employe.jsx'
import { Documents } from './pages/documents/documents.jsx'
import { UpdateDocuments } from './pages/updateDoc/updateDoc.jsx'
import { Asset } from './pages/assets-page/assets.jsx'

import AdminLayout from './layout/AdminLayout';
import { Interview } from './pages/interview/intervies.jsx'
import { PrivateRoute } from './layout/Private.jsx'
import { LoginPage } from './auth/AdminLogin.jsx'
import { EnterEmailPage} from './auth/email.jsx'
import { EmailVerificationPage } from './auth/emialVerification.jsx'
import { ForgetPassword } from './auth/ForgetPassword.jsx' 
import { InterviewForm } from './pages/interview_form/interview_form.jsx'
import { InterviewSuccess } from './pages/interview_form/interviewFormSccess.jsx'
function App() {


  return (
  <Routes>
    <Route index path='/' element={<LoginPage/>} />
    <Route path='/Email' element={<EnterEmailPage/>}/>
    <Route path='/forgetPassword' element={<ForgetPassword />}/>
    <Route path='/verification' element={<EmailVerificationPage/>}/>
    <Route path='/interviewForm' element={<InterviewForm/>}/>
    <Route path="/interview-success" element={<InterviewSuccess/>} />
    <Route element={<PrivateRoute/>}>
      <Route  element={ <AdminLayout />}>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/interview' element={<Interview/>} />
        <Route path='/onboarding' element={<Onboarding />} />
        <Route path='/employees' element={<Employees />} />
        <Route path='/documents' element={<Documents/>} />
        <Route path='/asset' element={<Asset/>} />
      </Route>
    </Route>
  </Routes>
  )
}

export default App
