import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

function AnalyticsDashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/food/history`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    window.open("/api/v1/food/export?format=csv", "_blank");
  };

  const mockWeeklyData = [
    { day: "Mon", cal: 1850, prot: 110, carbs: 210, fat: 58 },
    { day: "Tue", cal: 1920, prot: 125, carbs: 200, fat: 62 },
    { day: "Wed", cal: 1740, prot: 105, carbs: 185, fat: 54 },
    { day: "Thu", cal: 2100, prot: 140, carbs: 230, fat: 70 },
    { day: "Fri", cal: 1980, prot: 130, carbs: 215, fat: 65 },
    { day: "Sat", cal: 2250, prot: 145, carbs: 260, fat: 78 },
    { day: "Sun", cal: 1890, prot: 118, carbs: 205, fat: 60 },
  ];

  return (
    <div className="card glass-card">
      <div className="section-title-row">
        <div>
          <h2>📊 Analytics & Export Reports</h2>
          <p>Visual weekly calorie trends, macronutrient breakdowns, and downloadable nutrition logs.</p>
        </div>
        <button className="primary-button" onClick={handleExportCSV}>
          📥 Export CSV Log
        </button>
      </div>

      {/* Weekly Calorie Bar Chart Simulation */}
      <div className="chart-box">
        <h3>🔥 Weekly Calorie Consumption</h3>
        <div className="bar-chart">
          {mockWeeklyData.map((item, idx) => (
            <div key={idx} className="bar-col">
              <div className="bar-val">{item.cal}</div>
              <div
                className="bar"
                style={{ height: `${(item.cal / 2500) * 100}%` }}
              ></div>
              <div className="bar-label">{item.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Log Table */}
      <div className="history-table-container">
        <h3>📖 Recent Food Diary Entries</h3>
        {loading ? (
          <p>Loading food history...</p>
        ) : history.length === 0 ? (
          <p>No food history logged yet. Analyze a food photo to populate your diary!</p>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Food Item</th>
                <th>Cuisine</th>
                <th>Calories</th>
                <th>Logged Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row.id}>
                  <td>#{row.id}</td>
                  <td><strong>{row.foodName}</strong></td>
                  <td><span className="badge">{row.cuisine || "Global"}</span></td>
                  <td>🔥 {row.calories} kcal</td>
                  <td>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "Today"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
