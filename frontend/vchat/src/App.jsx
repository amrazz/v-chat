import React from 'react'
import Home from './pages/Home'
import UserAuth from './pages/UserAuth'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import PrivateRoute from './Routes/PrivateRoute'
import PublicRoute from './Routes/PublicRoute'
import EditProfile from './pages/EditProfile'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<PublicRoute><UserAuth /></PublicRoute>} />
        <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path='/profile/edit' element={<PrivateRoute><EditProfile /></PrivateRoute>} />
      </Routes>
      
    </Router>
  )
}

export default App
