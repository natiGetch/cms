import ViewAllwarper from '@/component/layout/viewAllwarper';
import OrderModal from '@/component/ui/orderModal';
import TableComponent from '@/component/ui/table';
import useFetchData from '@/hooks/useFetchData';
import { DownOutlined, InfoCircleOutlined, UpOutlined } from '@ant-design/icons';
import {Tag } from 'antd';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const News = () => {
  const [pagination, setPagination] = useState<any>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const { data } = useFetchData({
    endpoint: '/api/news',
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
      render: (_: any, record: {news : { _id: string }}): React.ReactNode => (
        <Link href={`/news/view/${record.news?._id}`}>
          <InfoCircleOutlined style={{ cursor: 'pointer' }} />
        </Link>
      ),
    },
    {
      title: 'Order',
      dataIndex: ['news','order'],
      key: 'order',
      align: 'center',
      width: 50,
      render: (_: any, record: {news :  {_id: string; order: number} }): React.ReactNode => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {
          record.news.order != 1 &&<UpOutlined
            style={{ cursor: 'pointer', marginBottom: 8 }}
            onClick={() => openModal(record.news._id, 'up')}
          />
          }
          {
            record.news.order != data?.newss[data?.newss?.length - 1]?.news?.order &&
            <DownOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => openModal(record.news._id, 'down')}
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
        title: 'Publish date',
        dataIndex: ['vcancy','publishDate'],
        width : 100,
        key: 'label',
        render : (_ : any, record : {news : {publishDate : string}}): React.ReactNode  =>(
           record?.news?.publishDate
        )
      },
    {
      title: 'Status',
      dataIndex: ['news' , 'visible'],
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
      data={data?.newss || []}
      columns={columns}
      renderTitle = {true}
      pagination={
        data?.newss?.length === 0
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
        api="/news"
        id={currentId}
        direction={currentDirection}
      />
    )}
  </ViewAllwarper>
  );
};

export default News;
