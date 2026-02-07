import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function AdminGuard() {
  // localStorage dagi tokenni tekshiradi
  const token = localStorage.getItem("admin_token");

  // agar token yo‘q → login sahifaga yuboradi
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // token bor → admin sahifalarni ko‘rsatadi
  return <Outlet />;
}

export default AdminGuard;
