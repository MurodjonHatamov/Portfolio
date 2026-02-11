import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import { useEffect, useState } from "react";
import { getMainPage } from "./api/mainPage";
import BlogDetail from "./pages/BlogDetail";
import Achievements from "./pages/Achievements";
import BottomNavigator from "./components/BottomNavigator";
import AdminRoutes from "./router/AdminRoutes";
import Sidebar from "./components/admin/Sidebar";
import { LanguageProvider } from "./context/LanguageContext";


function AppInner() {
  const [profile, setProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      try {
        const main = await getMainPage();
        setProfile(main?.[0] || null);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const token = localStorage.getItem("admin_token");

  // ✅ faqat admin sahifalarda
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>


{/* FOYDALANUVCHI SAYTI (admin emas) */}
{!isAdminPath && (
  <>
    <Navbar profile={profile} />
    <BottomNavigator />
  </>
)}
 {/* ADMIN PANEL */}
 {token && isAdminPath && <Sidebar />}

  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects profile={profile} />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/contact" element={<Contact profile={profile} />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/achievements" element={<Achievements />} />

        
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>

<LanguageProvider>
<AppInner />
</LanguageProvider>

  
    </BrowserRouter>
  );
}
