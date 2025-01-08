import ViewAllwarper from '@/component/layout/viewAllwarper';
import OrderModal from '@/component/ui/orderModal';
import TableComponent from '@/component/ui/table';
import useFetchData from '@/hooks/useFetchData';
import { DownOutlined, InfoCircleOutlined, UpOutlined } from '@ant-design/icons';
import {Tag } from 'antd';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Faq = () => {
  const [pagination, setPagination] = useState<any>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const { data } = useFetchData({
    endpoint: '/api/faq',
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
      render: (_: any, record: {faq : { _id: string }}): React.ReactNode => (
        <Link href={`/faq/view/${record.faq._id}`}>
          <InfoCircleOutlined style={{ cursor: 'pointer' }} />
        </Link>
      ),
    },
    {
      title: 'Order',
      dataIndex: ['faq','order'],
      key: 'order',
      align: 'center',
      width: 100,
      render: (_: any, record: {faq :  {_id: string; order: number} }): React.ReactNode => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {
          record.faq.order != 1 &&<UpOutlined
            style={{ cursor: 'pointer', marginBottom: 8 }}
            onClick={() => openModal(record.faq._id, 'up')}
          />
          }
          {
            record.faq.order != data?.faqs[data?.faqs?.length - 1]?.faq?.order &&
            <DownOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => openModal(record.faq._id, 'down')}
          />
          }
        </div>
      ),
    },
    {
      title: 'Question',
      dataIndex: 'question',
      width : 100,
      key: 'label',
      render : (_ : any, record : {translations : {question : string}[]}): React.ReactNode  =>(
         record?.translations[0]?.question 
      )
    },
    {
      
      title: 'Answer',
      dataIndex: 'answer',
      width : 500,
      key: 'key',
      render : (_ : any, record : {translations : {answer : string}[]}): React.ReactNode  =>(
        record?.translations[0]?.answer
     )
    },
    {
      title: 'Status',
      dataIndex: ['faq' , 'visible'],
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
      data={data?.faqs || []}
      columns={columns}
      renderTitle = {true}
      pagination={
        data?.faqs.length === 0
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
        api="/faq"
        id={currentId}
        direction={currentDirection}
      />
    )}
  </ViewAllwarper>
  );
};

export default Faq;
