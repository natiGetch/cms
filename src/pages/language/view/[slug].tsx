import DynamicForm from '@/component/forms/componetType'
import ViewDetailwraper from '@/component/layout/ViewDetailWarper'
import useFetchData from '@/hooks/useFetchData'
import { twoColumnLaout } from '@/utils/columnsLayout'
import { Col, Form, Row, Tag } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'

const ViewLanguage = () => {
    const router = useRouter()
    const {slug} = router.query
  
    const {data} = useFetchData({endpoint : `/api/language/`,id : slug})
    const leftFormConfig = [
        {
            name: 'label',
            label: 'Label',
            inputType: 'tag',
            initialValue  : data?.language[0]?.label
          
        },
        {
            name: 'key',
            label: 'Key',
            inputType: 'tag',
            initialValue  : data?.language[0]?.key
         
        },
        {
            name: 'isMandatory',
            label: 'Mandatory',
            inputType: 'tag',
            initialValue  : data?.language[0]?.isMandatory ? 'Mandatory ':  'Optional',
        },
        {
            name: 'visible',
            label: 'visible',
            inputType: 'tag',
            initialValue  : data?.language[0]?.visible ? <Tag color="green">Vissble</Tag> : <Tag color="red">Hidden</Tag>,
        }
    ]
    const rightFormConfig = [
        {
            name: 'createdBy',
            label: 'Created by',
            inputType: 'tag',
            initialValue : data?.language[0]?.createdBy 
          
        },
        {
            name: 'createdAt',
            label: 'Created at',
            inputType: 'tag',
            initialValue : data?.language[0]?.createdAt
        },
        {
            name: 'updatedBy',
            label: 'Updated by',
            inputType: 'tag',
            initialValue : data?.language[0]?.updatedBy 
          
        },
        {
            name: 'updatedAt',
            label: 'Updated at',
            inputType: 'tag',
            initialValue : data?.language[0]?.updatedAt 
        },
    ]

    
   

  return (
        <ViewDetailwraper>
           <Form layout='vertical'>
             <Row>
                <Col {...twoColumnLaout}>
                  <DynamicForm formConfig={leftFormConfig} />
                </Col>
                <Col {...twoColumnLaout}>
                <DynamicForm formConfig={rightFormConfig } />
                </Col>
             </Row>
           </Form>
        </ViewDetailwraper>
  )
}

export default ViewLanguage
