import DynamicForm from '@/component/forms/componetType';
import ImageUplaod from '@/component/forms/imageUpload';
import AddAndEditWraper from '@/component/layout/addAndEditWarper';
import ButtonComponent from '@/component/ui/button';
import useFetchData from '@/hooks/useFetchData';
import usePost from '@/hooks/usePost';
import { Checkbox, Col, Collapse, Form, Popover, Row,} from 'antd';
import React, { useEffect, useState } from 'react';

type FieldType = {
  title: string;
  subtitle: string;
  image: { response?: { filePath: string } }[]; 
  visible: boolean;
  translations: {
    [key: string]: {
      title: string;
      subtitle: string;
      enabled?: boolean;
    };
  };
};

const AddSlide = () => {
  const { data } = useFetchData({ endpoint: '/api/language' });
  const { handlePost } = usePost();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>();
  const [activeKeys, setActivekeys] = useState<string[]>([])
  const handleCheckboxChange = (langId: string, checked: boolean) => {
   
  };

  const handleFinish = async (values: FieldType) => {
  
    const payload = {
      image: values['image'][0]?.response?.filePath,
      visible: values['visible'],
      translations: Object.keys(values['translations'])
        .filter((key) => 
          data?.language?.filter((byKey : {key : string}) => 
            activeKeys?.includes(byKey.key)).
             some((filteredItem : {_id : string}) => filteredItem._id === key)
          )
          .map((key) => ({
          language: key,
          title: values['translations'][key].title,
          subtitle: values['translations'][key].subtitle,
        })),
    };
 
    const response = await handlePost('/api/slide', payload);
    if (response.success) {
      form.resetFields();
      setImageUrl(undefined);
  
    }
  };
useEffect(()=>{
  const mandatoryLanguages = data?.language?.filter((lang : { isMandatory : boolean }) => lang.isMandatory).map((lang : { key : string }) => lang.key)
  setActivekeys(mandatoryLanguages)
  
},[data])
  return (
    <AddAndEditWraper>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        form={form}
        onValuesChange={(changedValues) => {
          const [langId] = Object.keys(changedValues.translations || {});
          if (langId) {
            handleCheckboxChange(
              langId,
              changedValues.translations[langId]?.enabled
            );
          }
        }}
      >
        <Row>
          <Col xs={24} sm={6}>
            <ImageUplaod
              listType="picture-card"
              showList={false}
              formName="image"
              formLabel="Image"
              maxCount={1}
              isRequired={true}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
            />

            <DynamicForm
              formConfig={[
                {
                  name: 'visible',
                  label: 'Visible',
                  inputType: 'radio',
                  initialValue: false,
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
  {data?.language?.map((lang: { _id: string; key: string; label: string,isMandatory : boolean }) => (
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
            />
        }
          {lang.label}</div>}
      
      showArrow={false}
    >
          <DynamicForm
            formConfig={[
              {
                name: ['translations', lang._id, 'title'],
                label: 'Title',
                inputType: 'input',
                rules: [
                  {
                    required: lang.isMandatory || activeKeys?.includes(lang.key) , 
                    message: 'Enter Title',
                  }
                ],
              },
              {
                name: ['translations', lang._id, 'subtitle'],
                label: 'Subtitle',
                inputType: 'textArea',
                rules: [
                 {
                    required:  lang.isMandatory  || activeKeys?.includes(lang.key), 
                    message: 'Enter Subtitle',
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
    </AddAndEditWraper>
  );
};

export default AddSlide;

