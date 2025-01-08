import DynamicForm from '@/component/forms/componetType';
import FormListComponet from '@/component/forms/formList';
import AddAndEditWraper from '@/component/layout/addAndEditWarper';
import ButtonComponent from '@/component/ui/button';
import { useLoading } from '@/context/loadingContext';
import useFetchData from '@/hooks/useFetchData';
import useUpdate from '@/hooks/useUpdate';
import { Checkbox, Col, Collapse, Form, message, Popover, Row,} from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

type FieldType = {
  applyLink: string;
  deadLine: string;
 visible: boolean;
  translations: {
    [key: string]: {
      title: string;
      jobDescription: string;
      location : string[];
      responsibilities : string[];
      experience : string[];
      qualifications : string[]
    };
  };
};

const EditVacancy = () => {
    const router = useRouter()
    const { slug } = router.query
    const { data } = useFetchData({ endpoint: `/api/vacancy/`, id: slug })
    const { data: language } = useFetchData({ endpoint: '/api/language' });
    const {isLoading} = useLoading()
    const { updateById } = useUpdate();
  const [form] = Form.useForm();
  const [activeKeys, setActivekeys] = useState<string[]>([])
  const handleFinish = async (values: FieldType) => {
    const payload = {
      visible: values['visible'],
      applyLink:  values['applyLink'],
      deadLine:  values['deadLine'],
      translations: Object.keys(values['translations'])
        .filter((key) => 
            language?.language?.filter((byKey : {key : string}) => 
            activeKeys?.includes(byKey.key)).
             some((filteredItem : {_id : string}) => filteredItem._id === key)
          )
          .map((key) => ({
          language: key,
          title: values['translations'][key].title,
          jobDescription : values['translations'][key].jobDescription,
          location : values['translations'][key].location?.flat()?.filter(item => item !== undefined && typeof []),
          responsibilities  : values['translations'][key].responsibilities?.flat()?.filter(item => item !== undefined && typeof []),
          experience : values['translations'][key].experience?.flat()?.filter(item => item !== undefined && typeof []),
          qualifications  : values['translations'][key].qualifications?.flat()?.filter(item => item !== undefined && typeof [])
        })),
    };
    try {
        const response = await updateById('/api/vacancy', slug as string, payload);
        if (response) {
          router.push('/vacancy');
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
       (!isLoading  && activeKeys) &&
        <Form
        layout="vertical"
        onFinish={handleFinish}
        form={form}
      
      >
        <Row gutter={[12,12]}>
          <Col xs={24} lg ={7}>
            <DynamicForm
              formConfig={[
                {
                  name : 'applyLink',
                  label : 'Link',
                  inputType : 'input',
                  initialValue: data?.vacancy?.applyLink,
                  rules : [{
                    required : true,
                    message : 'Please enter Link',
                   }]
                },
                //  {
                //    name : 'deadLine',
                //    label : 'Deadline',
                //    inputType : 'datepicker',
                //    initialValue: data?.vacancy?.deadLine,
                //    rules : [{
                //     required : true,
                //     message : 'Please enter DeadLine',
                //    }]
                //  },
                {
                  name: 'visible',
                  label: 'Visible',
                  inputType: 'radio',
                  initialValue: data?.vacancy?.visible,
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
          <Col xs={24} lg={17} style={{maxHeight : '460px',overflow : 'auto',}}>
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
        <Row  justify='space-between'>
          <Col xs={24} lg={10}>
          <DynamicForm
            formConfig={[
              {
                name: ['translations', lang._id, 'title'],
                label: 'Job Title',
                inputType: 'input',
                initialValue : data?.translations?.find((trans : {language : string}) => trans.language == lang._id)?.title,
                rules: [
                  {
                    required: lang.isMandatory || activeKeys?.includes(lang.key) , 
                    message: 'Enter title',
                  }
                ],
              },
              {
                name: ['translations', lang._id, 'jobDescription'],
                label: 'Job Description',
                inputType: 'textArea',
                initialValue : data?.translations?.find((trans : {language : string}) => trans.language == lang._id)?.jobDescription,
                rules: [
                 {
                    required:  lang.isMandatory  || activeKeys?.includes(lang.key), 
                    message: 'Enter job Description',
                  }
                ],
              },
            ]}
          />
              <FormListComponet
                      name={['translations', lang._id,"location"]}
                      initialListValue={data?.translations?.find((trans : {language : string}) => trans.language == lang._id)?.location?.map((x : string)=> [x])}
                      formConfig={{
                        inputType: 'input',
                        label: 'Location',
                        rules: [{ required: true, message: 'Please input location' }],
                      }}
                    />
          </Col>
          <Col xs={24} lg={10}>
                  <FormListComponet
                      initialListValue={data?.translations?.find((trans : {language : string}) => trans.language == lang._id)?.responsibilities?.map((x : string) => [x])}
                      name={['translations', lang._id,"responsibilities"]}
                      formConfig={{
                        inputType: 'input',
                        label: 'Responsibilities',
                        rules: [{ required: true, message: 'Please input responsibilities' }],
                      }}
                    />
                    <FormListComponet
                    initialListValue={data?.translations?.find((trans : {language : string}) => trans.language == lang._id)?.experience?.map((x : string) => [x])}
                      name={['translations', lang._id,"experience"]}
                      formConfig={{
                        inputType: 'input',
                        label: 'Experience',
                       
                        rules: [{ required: true, message: 'Please input experience' }],

                      }}
                    />
                    
                    <FormListComponet
                    initialListValue={data?.translations?.find((trans : {language : string}) => trans.language == lang._id)?.qualifications?.map((x : string) => [x])}
                      name={['translations', lang._id,"qualifications"]}
                      formConfig={{
                        inputType: 'input',
                        label: 'Qualifications',
                        rules: [{ required: true, message: 'Please input qualifications' }],
                      }}
                    />

          </Col>
        </Row>
        </Collapse.Panel>
      ))}
   </Collapse>

          </Col>
          <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end',}}>
            <ButtonComponent type="primary" htmlType="submit" text="Submit" />
          </Col>
        </Row>
      </Form>
       }
    </AddAndEditWraper>
  );
};

export default EditVacancy;

