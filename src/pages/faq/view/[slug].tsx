import DynamicForm from '@/component/forms/componetType'
import ImageDownLoad from '@/component/forms/imageDownLoad'
import ViewDetailwraper from '@/component/layout/ViewDetailWarper'
import useFetchData from '@/hooks/useFetchData'
import { centerdColumnsLayout, singleColumnsLayout, twoColumnLaout } from '@/utils/columnsLayout'
import { Card, Row,Col, Tabs, Tag, Form, Flex } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'

const ViewFaqs = () => {
        const router = useRouter()
        const {slug} = router.query
    const {data} = useFetchData({endpoint : `/api/faq/`,id : slug})
    const { data : language } = useFetchData({endpoint: '/api/language'});
  return (
     <ViewDetailwraper>
       <Form layout='vertical'>
     
           <Card
           >
           <Row >
           <Col {...twoColumnLaout}>
                   <Tabs 
             
                items={
                    language?.language
                    ?.filter((lang: { _id: string }) =>
                        data?.translations?.some((translation: any) => translation.language === lang._id)
                    )
                    ?.map((lang: { _id: string; key: string; label: string }) => {
                        const translation = data?.translations?.find(
                        (translation: any) => translation.language === lang._id
                        );
                
                        return {
                        key: lang.key,
                        label: lang.label,
                        children: (  
                            <DynamicForm
                             formConfig={[
                               {
                                   name: 'question',
                                   label: 'Question',
                                   inputType: 'tag',
                                   initialValue  : translation?.question,
                               },    
                                {
                                    name: 'answer',
                                    label: 'Answer',
                                    inputType: 'tag',
                                    initialValue  :translation?.answer,
                                }
                             ]}
                           />
                           
                         ),
                        };
                    })
                }/>
                   </Col>
                   <Col {...twoColumnLaout}>
                     <DynamicForm
                      formConfig={[
                        
                        {
                            name: 'visible',
                            label: 'visible',
                            inputType: 'tag',
                            initialValue  : data?.faq?.visible ? <Tag color="green">Vissble</Tag> : 
                            <Tag color="red">Hidden</Tag>,
                        },
                        {
                          name: 'createdBy',
                          label: 'Created by',
                          inputType: 'tag',
                          initialValue : data?.faq?.createdBy 
                        
                      },
                      {
                          name: 'createdAt',
                          label: 'Created at',
                          inputType: 'tag',
                          initialValue : data?.faq?.createdAt
                      },
                      {
                          name: 'updatedBy',
                          label: 'Updated by',
                          inputType: 'tag',
                          initialValue : data?.faq?.updatedBy 
                        
                      },
                      {
                          name: 'updatedAt',
                          label: 'Updated at',
                          inputType: 'tag',
                          initialValue : data?.faq?.updatedAt 
                      },
                      ]}
                    />
                   </Col>
                 
             
          </Row>
           </Card>
       
       </Form>
     </ViewDetailwraper>
  )
}

export default ViewFaqs
