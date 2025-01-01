import ViewAllwarper from '@/component/layout/viewAllwarper';
import OrderModal from '@/component/ui/orderModal';
import TableComponent from '@/component/ui/table';
import useFetchData from '@/hooks/useFetchData';
import { DownOutlined, InfoCircleOutlined, UpOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Language = () => {
  const [pagination, setPagination] = useState<any>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const { data } = useFetchData({
    endpoint: '/api/language',
    page: pagination.page,
    limit: pagination.pageSize,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentDirection, setCurrentDirection] = useState<'up' | 'down' | null>(null);

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
  };

  const columns = [
    {
      title: 'View',
      dataIndex: '_id',
      key: 'view',
      align: 'center',
      width: 75,
      render: (_: any, record: { _id: string }): React.ReactNode => (
        <Link href={`/language/view/${record._id}`}>
          <InfoCircleOutlined style={{ cursor: 'pointer' }} />
        </Link>
      ),
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      align: 'center',
      width: 100,
      render: (_: any, record: { _id: string; order: number }): React.ReactNode => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {
          record.order != 1 &&<UpOutlined
            style={{ cursor: 'pointer', marginBottom: 8 }}
            onClick={() => openModal(record._id, 'up')}
          />
          }
          {
            record.order != data?.language[data?.language.length - 1].order &&
            <DownOutlined
            style={{ cursor: 'pointer' }}
            onClick={() => openModal(record._id, 'down')}
          />
          }
        </div>
      ),
    },
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Status',
      dataIndex: 'visible',
      key: 'visible',
      render: (visible : boolean): React.ReactNode =>
        visible ? <Tag color="green">Visible</Tag> : <Tag color="red">Hidden</Tag>,
    },
  ];

  return (
    <ViewAllwarper>
      <TableComponent
        data={data?.language || []}
        columns={columns}
        pagination={
          data?.language.length === 0
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
          api="/language"
          id={currentId}
          direction={currentDirection}
        />
      )}

    </ViewAllwarper>
  );
};

export default Language;
