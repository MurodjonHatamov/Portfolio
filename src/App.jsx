
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Projects from './pages/Projects'
import Sidebar from './components/Sidebar'

function App() {


  return (
    <>
  <BrowserRouter>
  <Navbar/>
  <Sidebar/>
  <Routes>
    <Route path='/' element={ <Home/> } />
    <Route path='/projects' element={ <Projects/> } />
  </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
