const Bikes = () => {
  return (
    <AdminLayout>
      <h2 className="text-xl mb-4">Bikes</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded-xl">
          <img src="/bike.jpg" className="h-40 w-full object-cover" />
          <h3>Pulsar 150</h3>

          <button className="bg-green-500 text-white px-3 py-1 mt-2 rounded">
            Approve
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Bikes;