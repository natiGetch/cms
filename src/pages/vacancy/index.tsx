import ViewAllwarper from '@/component/layout/viewAllwarper';
import OrderModal from '@/component/ui/orderModal';
import TableComponent from '@/component/ui/table';
import useFetchData from '@/hooks/useFetchData';
import { DownOutlined, InfoCircleOutlined, UpOutlined } from '@ant-design/icons';
import {Tag } from 'antd';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Vacancy = () => {
  const [pagination, setPagination] = useState<any>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const { data } = useFetchData({
    endpoint: '/api/vacancy',
    page: pagination.page,
    limit: pagination.pageSize,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentDirection, setCurrentDirection] = useState<'up' | 'down' | null>(null);
  const columns = [
    {
      title: 'View',
      dataIndex: '_id',
      key: 'view',
      align: 'center',
      width: 75,
      render: (_: any, record: {vacancy : { _id: string }}): React.ReactNode => (
        <Link href={`/vacancy/view/${record.vacancy._id}`}>
          <InfoCircleOutlined style={{ cursor: 'pointer' }} />
        </Link>
      ),
    },
    {
      title: 'Order',
      dataIndex: ['vacancy','order'],
      key: 'order',
      align: 'center',
      width: 50,
      render: (_: any, record: {vacancy :  {_id: string; order: number} }): React.ReactNode => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {
          record.vacancy.order != 1 &&<UpOutlined
            style={{ cursor: 'pointer', marginBottom: 8 }}
            onClick={() => openModal(record.vacancy._id, 'up')}
          />
          }
          {
            record.vacancy.order != data?.vacancies[data?.vacancies?.length - 1]?.vacancy?.order &&
            <DownOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => openModal(record.vacancy._id, 'down')}
          />
          }
        </div>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width : 100,
      key: 'label',
      render : (_ : any, record : {translations : {title : string}[]}): React.ReactNode  =>(
         record?.translations[0]?.title
      )
    },
    {
        title: 'Dead Line',
        dataIndex: ['vcancy','deadLine'],
        width : 100,
        key: 'label',
        render : (_ : any, record : {vacancy : {deadLine : string}}): React.ReactNode  =>(
           record?.vacancy?.deadLine
        )
      },
    {
      title: 'Status',
      dataIndex: ['vacancy' , 'visible'],
      width : 100,
      key: 'visible',
      render: (visible : boolean): React.ReactNode =>
        visible ? <Tag color="green">Visible</Tag> : <Tag color="red">Hidden</Tag>,
    },
  ];


  useEffect(() => {
    if (data) {
      const totalPages = Math.ceil(data.pagination.total / pagination.pageSize);

      setPagination({
        page: data.pagination.page,
        pageSize: data.pagination.limit,
        total: data.pagination.total,
        totalPages: totalPages,
      });
    }
  }, [data, pagination.pageSize]);

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({
      ...pagination,
      page: page,
      pageSize: pageSize,
    });
  };

  const openModal = (id: string, direction: 'up' | 'down') => {
    setCurrentId(id);
    setCurrentDirection(direction);
    setModalOpen(true);
  };;
  return (
    <ViewAllwarper>
    <TableComponent
      data={data?.vacancies || []}
      columns={columns}
      renderTitle = {true}
      pagination={
        data?.vacancies.length === 0
          ? undefined
          : {
              page: pagination.page,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: handlePageChange,
            }
      }
    />
    {modalOpen && currentId && currentDirection && (
      <OrderModal
        open={modalOpen}
        setOpen={setModalOpen}
        api="/vacancy"
        id={currentId}
        direction={currentDirection}
      />
    )}
  </ViewAllwarper>
  );
};

export default Vacancy;
