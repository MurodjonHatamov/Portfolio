
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Projects from './pages/Projects'
import Sidebar from './components/Sidebar'
import Experience from './pages/Experience'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import { useEffect, useState } from 'react'
import { getMainPage } from './api/mainPage'
import BlogDetail from './pages/BlogDetail'

function App() {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    (async () => {
      try {

        const main = await getMainPage();
        setProfile(main?.[0] || null);
  


     
             
      } catch (e) {
        console.error(e);
      } finally {
     
      }
    })();


  }, []);




  return (
    <>
  <BrowserRouter>
  <Navbar profile={profile}/>
  <Sidebar/>
  <Routes>
    <Route path='/' element={ <Home/> } />
    <Route path='/projects' element={ <Projects profile={profile}/> } />
    <Route path='/experience' element={ <Experience/> } />
    <Route path='/contact' element={ <Contact profile={profile}/> } />
    <Route path='/blog' element={ <Blog/> } />
    <Route path="/blog/:id" element={<BlogDetail />} />
  </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
