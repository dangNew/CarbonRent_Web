import React, { useEffect, useState } from 'react';
import { rentmobileDb } from '../components/firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graph = () => {
  const [goodsData, setGoodsData] = useState([]);

  useEffect(() => {
    const fetchGoodsData = async () => {
      const carbonCollection = collection(rentmobileDb, 'appraisals');
      const snapshot = await getDocs(carbonCollection);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGoodsData(data);
    };

    fetchGoodsData();
  }, []);

  // Function to get date parts (day, month, year)
  const getDateParts = (dateString) => {
    const date = new Date(dateString);
    return {
      day: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,  // Format: YYYY-MM-DD
      month: `${date.getFullYear()}-${date.getMonth() + 1}`,                  // Format: YYYY-MM
    };
  };

  // Get the current date
  const currentDate = new Date();
  const currentDateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;

  // Aggregate goods data based on date (daily or monthly)
  const aggregateAppraisals = (dateRange) => {
    const goodsMap = {};
    goodsData.forEach((good) => {
      const { goods_name, total_amount, quantity, created_date } = good;
      if (goods_name && total_amount && quantity && created_date) {
        const dateParts = getDateParts(created_date);

        // Use the selected date range (day or month)
        const dateKey = dateRange === 'daily' ? dateParts.day : dateParts.month;

        if (!goodsMap[goods_name]) {
          goodsMap[goods_name] = {};
        }
        if (!goodsMap[goods_name][dateKey]) {
          goodsMap[goods_name][dateKey] = { total_amount: 0, quantity: 0 };
        }

        goodsMap[goods_name][dateKey].total_amount += total_amount;
        goodsMap[goods_name][dateKey].quantity += quantity;
      }
    });

    return goodsMap;
  };

  // Handle daily and monthly aggregations
  const dailyAggregatedData = aggregateAppraisals('daily');
  const monthlyAggregatedData = aggregateAppraisals('monthly');

  // Prepare data for the Bar chart (Daily)
  const prepareChartData = (aggregatedData, highlightCurrentDate = false) => {
    const labels = Object.keys(aggregatedData);
    const totalAmountData = labels.map((label) =>
      Object.values(aggregatedData[label]).reduce((sum, item) => sum + item.total_amount, 0)
    );
    const quantityData = labels.map((label) =>
      Object.values(aggregatedData[label]).reduce((sum, item) => sum + item.quantity, 0)
    );

    const datasets = [
      {
        label: 'Total Appraisal Value',
        data: totalAmountData,
        backgroundColor: 'rgba(72, 191, 145, 0.8)', // Soft green
        borderColor: 'rgba(72, 191, 145, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Quantity',
        data: quantityData,
        backgroundColor: 'rgba(144, 190, 109, 0.8)', // Light green
        borderColor: 'rgba(144, 190, 109, 1)',
        borderWidth: 1,
      },
    ];

    if (highlightCurrentDate) {
      datasets.forEach((dataset) => {
        dataset.backgroundColor = dataset.data.map((value, index) =>
          labels[index] === currentDateKey ? 'rgba(255, 0, 0, 0.8)' : dataset.backgroundColor
        );
        dataset.borderColor = dataset.data.map((value, index) =>
          labels[index] === currentDateKey ? 'rgba(255, 0, 0, 1)' : dataset.borderColor
        );
      });
    }

    return {
      labels,
      datasets,
    };
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Most Appraised Goods Analysis',
        font: { size: 20, family: 'Arial', weight: '600', color: '#48BF91' },
      },
      legend: {
        labels: {
          color: '#333',
          font: { size: 12, family: 'Arial', weight: '500' },
        },
      },
      tooltip: {
        backgroundColor: '#f5f5f5',
        titleColor: '#48BF91',
        bodyColor: '#333',
        borderColor: '#48BF91',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += `₱${context.parsed.y}`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#E5E5E5',
        },
        title: {
          display: true,
          text: 'Goods Name',
          color: '#333',
          font: { size: 14, weight: '500' },
        },
        ticks: {
          color: '#333',
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: {
          color: '#E5E5E5',
        },
        title: {
          display: true,
          text: 'Value / Quantity',
          color: '#333',
          font: { size: 14, weight: '500' },
        },
        ticks: {
          color: '#333',
        },
      },
    },
  };

  return (
    <div
      style={{
        maxWidth: '950px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow
        backgroundColor: '#fff',
        border: '2px solid #48BF91', // Added border
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          color: '#48BF91',
          marginBottom: '10px',
          fontFamily: 'Arial, sans-serif',
          fontWeight: '600',
        }}
      >
        Appraisal Analytics: Most Appraised Goods
      </h2>
      {/* Display Daily Data */}
      <h3 style={{ color: '#48BF91', textAlign: 'center', marginBottom: '20px' }}>
        Daily Appraisals
      </h3>
      <div style={{ height: '400px' }}>
        <Bar data={prepareChartData(dailyAggregatedData, true)} options={options} />
      </div>

      {/* Display Monthly Data */}
      <h3 style={{ color: '#48BF91', textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
        Monthly Appraisals
      </h3>
      <div style={{ height: '400px' }}>
        <Bar data={prepareChartData(monthlyAggregatedData)} options={options} />
      </div>
    </div>
  );
};

export default Graph;