import useUpdate from '@/hooks/useUpdate';
import { Modal, message } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string | any;
  api: string;
  direction: 'up' | 'down';
};

const OrderModal = ({ open, setOpen, api, id, direction }: Props) => {
  const { updateById } = useUpdate();
  const router = useRouter()
  const handleOk = async () => {
    try {
      const reponce = await updateById(`/api${api}`, id, {},direction); 
      if(reponce){
        router.reload()
      }
      
    } catch (error) {
   
      console.error('Error updating language order:', error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={() => setOpen(false)}
      title={`Change Order (${direction})`}
      destroyOnClose
    >
      <p>Are you sure you want to move the language {direction}?</p>
    </Modal>
  );
};

export default OrderModal;
