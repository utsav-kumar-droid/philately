import React from "react";
import { Routes, Route } from "react-router-dom";

import ExploreStamps from "../../pages/ExploreStamps";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import Login from "../auth/Login";
import ProtectedRoute from "../layout/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ExploreStamps />} />

      <Route
        path="/explore-stamps"
        element={<ExploreStamps />}
      />

      <Route path="/login" element={<Login />} />

      <Route
        path="/admin-dashboard"
         element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;