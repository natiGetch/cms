import React from 'react';
import { Table, TableProps } from 'antd';

interface TableComponentProps extends TableProps<any> {
  data: any[]; 
  columns:any[]; 
  pagination?: {
    page: number; 
    pageSize: number;
    total?: number; 
    onChange: (page: number, pageSize: number) => void; 
  };
  loading?: boolean; 
}

const TableComponent = ({
  data,
  columns,
  pagination,
  loading = false,
  ...restProps
}: TableComponentProps) => {
  return (
    <Table
      dataSource={data}
      columns={columns}
      loading={loading}
      bordered
      
      pagination={{
      
        current: pagination?.page,
        pageSize: pagination?.pageSize,
        total: pagination?.total,
        showSizeChanger: true,
        onChange: pagination?.onChange,
        
      }}
      {...restProps} 
    />
  );
};

export default TableComponent;
