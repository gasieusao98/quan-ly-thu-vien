import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import './statistics-chart.css';

const StatisticsChart = ({ title, data, dataKey, nameKey, color = '#3b82f6' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="statistics-chart-container">
        <div className="chart-title">{title}</div>
        <div className="chart-empty">
          <p>Không có dữ liệu để hiển thị</p>
        </div>
      </div>
    );
  }

  // Tạo mảng màu gradient cho các cột
  const colors = [
    '#3b82f6', // Xanh dương
    '#10b981', // Xanh lá
    '#f59e0b', // Vàng cam
    '#ef4444', // Đỏ
    '#8b5cf6', // Tím
    '#06b6d4', // Xanh cyan
    '#ec4899', // Hồng
    '#14b8a6', // Teal
    '#f97316', // Orange
    '#6366f1'  // Indigo
  ];

  return (
    <div className="statistics-chart-container">
      <div className="chart-title">{title}</div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={nameKey}
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Số lượng', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
              formatter={(value) => value}
            />
            <Legend />
            <Bar 
              dataKey={dataKey} 
              name={dataKey === 'borrowCount' ? 'Số lần mượn' : 'Lần mượn'}
              fill={color}
              radius={[8, 8, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatisticsChart;