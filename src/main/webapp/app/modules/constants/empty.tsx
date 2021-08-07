import { Empty } from 'antd';
import React from 'react';

export const empty = () => (
  <div style={{ height: '205px' }} className="d-flex justify-content-center align-items-center">
    <div>
      {
        // @ts-ignore
        <Empty description="Không có dữ liệu .." />
      }
    </div>
  </div>
);
