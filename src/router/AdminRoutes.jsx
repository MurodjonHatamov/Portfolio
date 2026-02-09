import React from "react";
import { Routes, Route } from "react-router-dom";

import Projects from "../pages/admin/Projects";
import Login from "../pages/admin/Login";
import AdminGuard from "./AdminGuard";
import Home from "../pages/admin/Home";
import Experience from "../pages/admin/Experience";
import Blog from "../pages/admin/Blog";
import Contact from "../pages/admin/Contact";
import Achievements from "../pages/admin/Achievements";
import Profile from "../pages/admin/Profile";

function AdminRoutes() {
  return (
    <Routes>

      {/* LOGIN — hammaga ochiq */}
      <Route path="login" element={<Login />} />
     
      {/* PROTECTED ROUTES */}
      <Route path="/" element={<AdminGuard />}>
        <Route index element={<Home/>} />
        <Route path="projects" element={<Projects />} />
        <Route path="profile" element={<Profile/>} />
        <Route path="experience" element={<Experience />} />
        <Route path="blog" element={<Blog />} />
        <Route path="messages" element={<Contact />} />
        <Route path="achievements" element={<Achievements />} />
      </Route>

    </Routes>
  );
}

export default AdminRoutes;
