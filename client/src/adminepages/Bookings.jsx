const Bookings = () => {
  return (
    <AdminLayout>
      <h2 className="text-xl mb-4">Bookings</h2>

      <table className="w-full bg-white shadow rounded-xl">
        <thead>
          <tr>
            <th>User</th>
            <th>Bike</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr className="text-center">
            <td>Himanshu</td>
            <td>Activa</td>
            <td>Confirmed</td>
          </tr>
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default Bookings;