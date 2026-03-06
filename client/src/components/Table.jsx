const Table = ({ columns, data }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-left">

        {/* Header */}
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="p-3 text-sm font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">

              {Object.values(row).map((val, j) => (
                <td key={j} className="p-3">
                  {val}
                </td>
              ))}

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default Table;