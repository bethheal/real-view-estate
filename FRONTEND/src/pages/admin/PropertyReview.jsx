import { useEffect, useState } from "react";
import { api } from "../../config/axios";
import { Link } from "react-router-dom";

export default function PropertiesReview() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    api.get("/admin/properties/pending").then(res => {
      setProperties(res.data);
    });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-orange-600 mb-6">
        Pending Property Approvals
      </h2>

      {properties.length === 0 && (
        <p className="text-gray-600">No properties awaiting review.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {properties.map((prop) => (
          <Link
            to={`/admin/properties/${prop._id}`}
            key={prop._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={prop.images[0]}
              alt=""
              className="h-40 w-full object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-lg">{prop.title}</h3>
            <p className="text-sm text-gray-600">{prop.location}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
