import React, { useEffect, useState } from 'react';
import { rentmobileDb } from '../components/firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styled from 'styled-components';

// Register necessary ChartJS components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ChartContainer = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  background: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-bottom: 20px;
`;

const TitleText = styled.h2`
  text-align: center;
  color: #333;
  font-size: 1.5em;
  margin-bottom: 20px;
`;

const LoginAnalytics = () => {
  const [stallData, setStallData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStallData = async () => {
      const vendorsCollection = collection(rentmobileDb, 'approvedVendors');
      const snapshot = await getDocs(vendorsCollection);
      const vendors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      console.log('Fetched vendors:', vendors);

      // Count users by stall location
      const stallCounts = {};
      vendors.forEach(vendor => {
        const location = vendor.stallInfo?.location || 'Unknown';
        stallCounts[location] = (stallCounts[location] || 0) + 1;
      });

      // Convert counts to sorted array
      const stallArray = Object.keys(stallCounts).map(location => ({
        location,
        count: stallCounts[location],
      })).sort((a, b) => b.count - a.count);

      setStallData(stallArray);
      setLoading(false);
    };

    fetchStallData();
  }, []);

  const data = {
    labels: stallData.map(stall => stall.location),
    datasets: [
      {
        label: 'Users per Location',
        data: stallData.map(stall => stall.count),
        backgroundColor: 'rgba(75, 192, 75, 0.6)', // Green background
        borderColor: 'rgba(75, 192, 75, 1)', // Darker green border
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75, 192, 75, 0.8)', // Slightly darker green on hover
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#666',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#666',
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: '#e0e0e0',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#666',
          stepSize: 10,
        },
        grid: {
          color: '#e0e0e0',
        },
      },
    },
  };

  return (
    <ChartContainer>
      <TitleText>Stall Location Analytics</TitleText>
      {loading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Loading data...</p>
      ) : (
        <Bar data={data} options={options} />
      )}
    </ChartContainer>
  );
};

export default LoginAnalytics;
