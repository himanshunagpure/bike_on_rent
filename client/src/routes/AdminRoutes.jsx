import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";

import Dashboard from "../adminepages/Dashboard";
import Users from "../adminepages/Users";
import Vendors from "../adminepages/Vendors";
import Bikes from "../adminepages/Bikes";
import Bookings from "../adminepages/Bookings";
import Payments from "../adminepages/Payments";
import Settings from "../adminepages/Settings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="bikes" element={<Bikes />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="payments" element={<Payments />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;