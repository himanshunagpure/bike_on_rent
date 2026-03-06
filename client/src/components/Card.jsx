const Card = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>

        {icon && (
          <div className="text-3xl text-blue-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;