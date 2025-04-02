import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginRegisterPage/LoginPage'
import RegisterPage from './pages/LoginRegisterPage/RegisterPage'

function App() {

  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='*' element={<Navigate to='/login'/>} />
      </Routes>
    </>
  )
}

export default App
