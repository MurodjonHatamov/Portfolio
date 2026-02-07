import React from "react";
import { Routes, Route } from "react-router-dom";

import Projects from "../pages/admin/Projects";
import Login from "../pages/admin/Login";
import AdminGuard from "./AdminGuard";
import Home from "../pages/admin/Home";

function AdminRoutes() {
  return (
    <Routes>

      {/* LOGIN — hammaga ochiq */}
      <Route path="login" element={<Login />} />
     
      {/* PROTECTED ROUTES */}
      <Route path="/" element={<AdminGuard />}>
        <Route index element={<Home/>} />
        <Route path="projects" element={<Projects />} />
        <Route path="mainpage" element={<Projects />} />
        <Route path="experience" element={<Projects />} />
        <Route path="blog" element={<Projects />} />
      </Route>

    </Routes>
  );
}

export default AdminRoutes;
