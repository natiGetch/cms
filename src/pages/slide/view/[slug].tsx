import DynamicForm from '@/component/forms/componetType'
import ImageDownLoad from '@/component/forms/imageDownLoad'
import ViewDetailwraper from '@/component/layout/ViewDetailWarper'
import useFetchData from '@/hooks/useFetchData'
import { centerdColumnsLayout, singleColumnsLayout, twoColumnLaout } from '@/utils/columnsLayout'
import { Card, Row,Col, Tabs, Tag, Form, Flex } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'

const ViewSlide = () => {
        const router = useRouter()
        const {slug} = router.query
    const {data} = useFetchData({endpoint : `/api/slide/`,id : slug})
    const { data : language } = useFetchData({endpoint: '/api/language'});
  return (
     <ViewDetailwraper>
       <Form layout='vertical'>
     
           <Card
           >
           <Row >
            <Col xs={24} sm={4}>
              <Flex justify='center' align='center'>
                  <ImageDownLoad
                height={155}
                width={150}
                path={data?.slide?.image}/>
              </Flex>
            
            </Col>
            <Col xs={24} sm={20}>
               <Row gutter={[64,12]}>
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
                                   name: 'title',
                                   label: 'Title',
                                   inputType: 'tag',
                                   initialValue  : translation?.title,
                               },    
                                {
                                    name: 'subtitle',
                                    label: 'Sub Title',
                                    inputType: 'tag',
                                    initialValue  :translation?.subtitle,
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
                            initialValue  : data?.slide?.visible ? <Tag color="green">Vissble</Tag> : 
                            <Tag color="red">Hidden</Tag>,
                        },
                        {
                          name: 'createdBy',
                          label: 'Created by',
                          inputType: 'tag',
                          initialValue : data?.slide?.createdBy 
                        
                      },
                      {
                          name: 'createdAt',
                          label: 'Created at',
                          inputType: 'tag',
                          initialValue : data?.slide?.createdAt
                      },
                      {
                          name: 'updatedBy',
                          label: 'Updated by',
                          inputType: 'tag',
                          initialValue : data?.slide?.updatedBy 
                        
                      },
                      {
                          name: 'updatedAt',
                          label: 'Updated at',
                          inputType: 'tag',
                          initialValue : data?.slide?.updatedAt 
                      },
                      ]}
                    />
                   </Col>
                  
               </Row>
               
            </Col>
          </Row>
           </Card>
       
       </Form>
     </ViewDetailwraper>
  )
}

export default ViewSlide
