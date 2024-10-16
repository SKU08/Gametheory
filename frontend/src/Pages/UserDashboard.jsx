import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  const user = useSelector((state) => state.auth);
  const [centers, setCenters] = useState([]);
  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [date, setDate] = useState("");

  // Fetch all centers on component mount
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/manager/centers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCenters(data.centers);
        } else {
          console.error("Failed to fetch centers:", response.status);
        }
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };

    fetchCenters();
  }, []);

  // Fetch sports for the selected center
  useEffect(() => {
    const fetchSports = async () => {
      if (selectedCenter) {
        try {
          const response = await fetch(`http://localhost:5000/api/manager/centers/${selectedCenter}/sports`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setSports(data.sports);
            setSelectedSport(""); // Reset sport selection
            setCourts([]); // Reset courts on center change
          } else {
            console.error("Failed to fetch sports:", response.status);
          }
        } catch (error) {
          console.error("Error fetching sports:", error);
        }
      }
    };

    fetchSports();
  }, [selectedCenter]);

  // Fetch courts for the selected sport
  useEffect(() => {
    const fetchCourts = async () => {
      if (selectedSport) {
        try {
          const response = await fetch(`http://localhost:5000/api/manager/sports/${selectedSport}/courts`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setCourts(data.courts);
          } else {
            console.error("Failed to fetch courts:", response.status);
          }
        } catch (error) {
          console.error("Error fetching courts:", error);
        }
      }
    };

    fetchCourts();
  }, [selectedSport]);

  // Handle date change
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // Handle booking
  const handleBooking = (courtId, slot, date) => {
    console.log(`Booking court ${courtId} for slot ${slot} on date ${date}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name || "Guest"}!</h1>

      {/* Dropdowns for selecting center, sport, and date */}
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="block mb-2">Select Center:</label>
          <select
            value={selectedCenter}
            onChange={(e) => setSelectedCenter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select a center</option>
            {centers.map((center) => (
              <option key={center._id} value={center._id}>
                {center.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCenter && (
          <div>
            <label className="block mb-2">Select Sport:</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Select a sport</option>
              {sports.map((sport) => (
                <option key={sport._id} value={sport._id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedSport && (
          <div>
            <label className="block mb-2">Select Date:</label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="p-2 border rounded"
              required
            />
          </div>
        )}
      </div>

      {selectedSport && date && (
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold mb-2">Available Courts</h2>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border-b p-2 text-center font-bold">Time Slot</th>
                {courts.map((court) => (
                  <th key={court.id} className="border-b p-2 text-center font-bold">{court.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courts.length > 0 && courts[0].slots.map((slot, index) => (
                <tr key={index}>
                  <td className="border-b p-2 text-center">{slot.slot}</td>
                  {courts.map((court) => (
                    <td key={court.id} className="border-b p-2 text-center">
                      {slot.available ? (
                        <button
                          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
                          onClick={() => handleBooking(court.id, slot.slot, date)}
                        >
                          Book
                        </button>
                      ) : (
                        <span className="text-red-500">Booked</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
