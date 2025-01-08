import DynamicForm from '@/component/forms/componetType';
import AddAndEditWraper from '@/component/layout/addAndEditWarper';
import ButtonComponent from '@/component/ui/button';
import { useLoading } from '@/context/loadingContext';
import useFetchData from '@/hooks/useFetchData';
import useUpdate from '@/hooks/useUpdate';
import { Checkbox, Col, Collapse, Form, Popover, Row,} from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

type FieldType = {
  question: string;
      answer: string;
   visible: boolean;
  translations: {
    [key: string]: {
      question: string;
      answer: string;
     
    };
  };
};

const Edit = () => {
        const {isLoading} = useLoading()
    const router = useRouter()
    const {slug} = router.query
    const {data} = useFetchData({endpoint : `/api/faq/`,id : slug})
  const { data : language } = useFetchData({ endpoint: '/api/language' });
  const { updateById } = useUpdate();
  const [form] = Form.useForm();
  const [activeKeys, setActivekeys] = useState<string[]>([])
  const handleFinish = async (values: FieldType) => {
    const payload = {
      visible: values['visible'],
      translations: Object.keys(values['translations'])
        .filter((key) => 
            language?.language?.filter((byKey : {key : string}) => 
            activeKeys?.includes(byKey.key)).
             some((filteredItem : {_id : string}) => filteredItem._id === key)
          )
          .map((key) => ({
          language: key,
          question: values['translations'][key].question,
          answer: values['translations'][key].answer,
        })),
    };
    try {
        const response = await updateById('/api/faq', slug as string, payload);
        if (response) {
          router.push('/faq');
        }
      } catch (error) {
        console.error('Error updating language:', error);
      }
  };
useEffect(()=>{
        const mandatoryLanguages = language?.language?.filter((lang: { _id: string }) =>
            data?.translations?.some((translation: any) => translation.language === lang._id)
        )
        .map((lang : { key : string }) => lang.key)
        setActivekeys(mandatoryLanguages)

        },[data])
  return (
    <AddAndEditWraper>
      {
       !isLoading  && activeKeys &&
       <Form
       layout="vertical"
       onFinish={handleFinish}
       form={form}
     
     >
       <Row>
         <Col xs={24} sm={6}>
           <DynamicForm
             formConfig={[
               {
                 name: 'visible',
                 label: 'Visible',
                 inputType: 'radio',
                 initialValue: data?.faq?.visible,
                 inputProps: {
                   options: [
                     {
                       label: 'Visible',
                       value: true,
                     },
                     {
                       label: 'Hidden',
                       value: false,
                     },
                   ],
                   optionType: 'button',
                   buttonStyle: 'solid',
                 },
               },
             ]}
           />
         </Col>
         <Col xs={24} sm={18} style={{maxHeight : '460px',overflow : 'auto',}}>
         <Collapse
         activeKey={activeKeys} //
       >
 {language?.language?.map((lang: { _id: string; key: string; label: string,isMandatory : boolean }) => (
   <Collapse.Panel
 
     key={lang.key}
     header={ <div style={{display:'flex',gap : '1em'}}>
       {
         lang.isMandatory ?
          <Popover
          title='Since the languge is mandatory you must add this contnet in this laguage'
          trigger='click'>
           <Checkbox checked/> 
          </Popover>:
             <Checkbox
             onClick={() =>
               setActivekeys((prevArray) => {
                 if (lang?.key && prevArray.includes(lang.key)) {
                  
                   return prevArray.filter((item) => item !== lang.key);
                 } else if (lang?.key) {
                 
                   return [...prevArray, lang.key];
                 }
                 return prevArray;
               })
             }
             defaultChecked = {activeKeys.includes(lang.key)}
           />
       }
         {lang.label}</div>}
     
     showArrow={false}
   >
         <DynamicForm
           formConfig={[
             {
               name: ['translations', lang._id, 'question'],
               label: 'Question',
               inputType: 'input',
               initialValue : data?.translations?.find((trans : {language : string}) => trans.language == lang._id)?.question,
               rules: [
                 {
                   required: lang.isMandatory || activeKeys?.includes(lang.key) , 
                   message: 'Enter Question',
                 }
               ],
             },
             {
               name: ['translations', lang._id, 'answer'],
               label: 'Answer',
               inputType: 'textArea',
               initialValue : data?.translations?.find((trans : {language : string}) => trans.language == lang._id)?.answer,
               rules: [
                {
                   required:  lang.isMandatory  || activeKeys?.includes(lang.key), 
                   message: 'Enter Answer',
                 }
               ],
             },
           ]}
         />
       </Collapse.Panel>
     ))}
  </Collapse>

         </Col>
         <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end',paddingTop : '1em'}}>
           <ButtonComponent type="primary" htmlType="submit" text="Submit" />
         </Col>
       </Row>
     </Form>
      }
    </AddAndEditWraper>
  );
};

export default Edit;

