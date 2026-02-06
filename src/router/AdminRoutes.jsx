import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Projects from '../pages/admin/Projects'

function AdminRoutes() {
  return (
<Routes>
    <Route path='/' element={ <Projects/> } />
</Routes>
  )
}

export default AdminRoutes