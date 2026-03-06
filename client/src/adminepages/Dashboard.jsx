import AdminLayout from "../layout/AdminLayout";

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <h3>Total Users</h3>
          <p className="text-2xl font-bold">120</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3>Total Bikes</h3>
          <p className="text-2xl font-bold">80</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3>Bookings</h3>
          <p className="text-2xl font-bold">300</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3>Revenue</h3>
          <p className="text-2xl font-bold">₹50,000</p>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Dashboard;