const Vendors = () => {
  return (
    <AdminLayout>
      <h2 className="text-xl mb-4">Vendors</h2>

      <table className="w-full bg-white shadow rounded-xl">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Approve</th>
          </tr>
        </thead>

        <tbody>
          <tr className="text-center">
            <td>Vendor 1</td>
            <td>Pending</td>
            <td>
              <button className="bg-green-500 px-3 py-1 text-white rounded">
                Approve
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </AdminLayout>
  );
};


export default Vendors;