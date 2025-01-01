import useDelete from '@/hooks/useDelete'
import { Modal } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'
type Props = {
   open : boolean,
   setOpen : (ope : boolean ) => void,
   id : string | any,
   api : string,
   afterAction : 'reload' | 'push'

}
const DeleteModal = ({open,setOpen,api,id,afterAction} :Props)  => {
  const {deleteById} = useDelete()
  const router = useRouter()
  const handleOk = async () =>{
    try {
      const response = await deleteById(`/api${api}`,id);
      if (response) {
          if(afterAction == 'push') {
            router.push(api);
          }
          else if (afterAction == 'reload') {
            router.reload()
          } 
      }
    } catch (error) {
     
      console.error('Error updating language:', error);
    }
    finally{
      setOpen(false)
    }
  }
  return (
    <Modal
    open={open}
    onOk={handleOk}
    onCancel={()=>setOpen(false)}
    title = {'Delete'} >
       <p>
         Are you sure 
       </p>
    </Modal>
  )
}

export default DeleteModal
