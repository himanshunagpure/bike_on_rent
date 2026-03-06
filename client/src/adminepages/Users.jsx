import AdminLayout from "../layout/AdminLayout";

const Users = () => {
  return (
    <AdminLayout>
      <h2 className="text-xl mb-4">Users</h2>

      <table className="w-full bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr className="text-center">
            <td>Himanshu</td>
            <td>test@gmail.com</td>
            <td>Active</td>
            <td>
              <button className="bg-red-500 text-white px-3 py-1 rounded">
                Block
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default Users;