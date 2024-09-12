import { Button, Select } from 'antd';
import React from 'react';

const { Option } = Select;

const UserFilter = ({ groups, selectedTeam, onTeamChange, onSearch }) => {
  return (
    <div className="filter-container">
      <Select
        style={{ width: 200, marginRight: 10 }}
        onChange={onTeamChange}
        value={selectedTeam}
      >
        <Option value="">전체</Option>
        {groups.map((group) => (
          <Option key={group._id} value={group._id}>
            {group.team}
          </Option>
        ))}
      </Select>
      <Button type="primary" onClick={onSearch}>
        조회
      </Button>
    </div>
  );
};

export default UserFilter;
