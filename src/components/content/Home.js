import React from 'react';
import SimpleBarChart from './external/SimpleBarChart';
import SimpleLineChart from './external/SimpleLineChart';
import TagBookSearch from './external/TagBookSearch';

const Home = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}>
        <TagBookSearch />
      </div>
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, borderBottom: '1px solid #f0f0f0' }}>
          <h2>선그림 테스트</h2>
          <SimpleLineChart />
        </div>
        <div style={{ flex: 1, paddingTop: '20px' }}>
          <h2>막대그림 테스트</h2>
          <SimpleBarChart />
        </div>
      </div>
    </div>
  );
}

export default Home;
