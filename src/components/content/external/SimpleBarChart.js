import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const SimpleBarChart = () => {
  const [data, setData] = useState([]);
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#33FFF6', '#FF8C33', '#8D33FF', '#FFC300', '#DAF7A6', '#C70039', '#900C3F',
    '#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#33FFF6', '#FF8C33', '#8D33FF', '#FFC300', '#DAF7A6', '#C70039', '#900C3F'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + '/api/management/group-count');
        // 응답 데이터를 Recharts에 맞게 변환
        const chartData = response.data.map((item, index) => ({ name: item.groupName, 권수: item.count, fill: colors[index] }));
        setData(chartData);
      } catch (error) {
        console.error('Error fetching group book counts:', error);
      }
    };

    fetchData();
  }, []);


  return (
  <ResponsiveContainer width="100%" height={210}>
    <BarChart width={730} height={280} data={data} margin={{ left: -10}}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
          dataKey="name" 
          tick={{ fontSize: 10 }} 
          angle={-45} 
          textAnchor="end" 
          height={70}
        />
      <YAxis tick={{ fontSize: 10 }} padding={{ top: 10 }}/>
      <Tooltip />
      
      <Bar dataKey="권수" fill="#8884d8" label={{ position: 'top', fontSize: 10 }} radius={[15, 15, 0, 0]} barSize={20}>
        {data.map((entry, index) => (
          <cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
  )
};

export default SimpleBarChart;
