
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Projects from './pages/Projects'
import Sidebar from './components/Sidebar'
import Experience from './pages/Experience'
import Contact from './pages/Contact'
import Blog from './pages/Blog'

function App() {


  return (
    <>
  <BrowserRouter>
  <Navbar/>
  <Sidebar/>
  <Routes>
    <Route path='/' element={ <Home/> } />
    <Route path='/projects' element={ <Projects/> } />
    <Route path='/experience' element={ <Experience/> } />
    <Route path='/contact' element={ <Contact/> } />
    <Route path='/blog' element={ <Blog/> } />
  </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
