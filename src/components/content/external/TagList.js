import { Tag } from 'antd';
import React from 'react';

const TagList = ({ tags, selectedTag, handleTagClick }) => {
  return (
    <div>
      {tags.map(tag => (
        <Tag
          key={tag.Code}
          color={selectedTag === tag.Code ? 'blue' : 'default'}
          onClick={() => handleTagClick(tag.Code)}
          style={{ cursor: 'pointer', marginBottom: '8px' }}
        >
          {tag.Name}
        </Tag>
      ))}
    </div>
  );
};

export default TagList;
