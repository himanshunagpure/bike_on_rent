import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-black text-white fixed">
      <h2 className="text-2xl font-bold p-5">Admin Panel</h2>

      <nav className="flex flex-col gap-4 p-5">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/vendors">Vendors</Link>
        <Link to="/admin/bikes">Bikes</Link>
        <Link to="/admin/bookings">Bookings</Link>
        <Link to="/admin/payments">Payments</Link>
        <Link to="/admin/settings">Settings</Link>
      </nav>
    </div>
  );
};

export default Sidebar;