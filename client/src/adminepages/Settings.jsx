const Settings = () => {
  return (
    <AdminLayout>
      <h2 className="text-xl mb-4">Settings</h2>

      <div className="bg-white p-5 rounded-xl shadow">
        <label>Commission %</label>
        <input
          type="number"
          className="border p-2 w-full mt-2"
        />
      </div>
    </AdminLayout>
  );
};

export default Settings;