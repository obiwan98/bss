import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const SimpleBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + '/api/management/group-count');
        // 응답 데이터를 Recharts에 맞게 변환
        const chartData = response.data.map(item => ({ name: item.groupName, 권수: item.count }));
        setData(chartData);
        console.log(data);
      } catch (error) {
        console.error('Error fetching group book counts:', error);
      }
    };

    fetchData();
  }, []);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#d0ed57', '#a4de6c', '#ff8042'];

  return (
  <ResponsiveContainer width="100%" height={210}>
    <BarChart width={730} height={280} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
          dataKey="name" 
          tick={{ fontSize: 10 }} 
          angle={-45} 
          textAnchor="end" 
          height={70}
        />
      <YAxis />
      <Tooltip />
      
      <Bar dataKey="권수" fill="#8884d8" label={{ position: 'top', fontSize: 10 }}>
          {data.map((entry, index) => (
            <cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
    </BarChart>
  </ResponsiveContainer>
  )
};

export default SimpleBarChart;
