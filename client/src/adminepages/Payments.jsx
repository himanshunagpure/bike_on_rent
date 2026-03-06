const Payments = () => {
  return (
    <AdminLayout>
      <h2 className="text-xl mb-4">Payments</h2>

      <table className="w-full bg-white shadow rounded-xl">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr className="text-center">
            <td>₹1000</td>
            <td>Paid</td>
          </tr>
        </tbody>
      </table>
    </AdminLayout>
  );
};


export default Payments;