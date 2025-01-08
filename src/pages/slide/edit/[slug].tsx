import DynamicForm from '@/component/forms/componetType';
import ImageDownLoad from '@/component/forms/imageDownLoad';
import ImageUplaod from '@/component/forms/imageUpload';
import AddAndEditWraper from '@/component/layout/addAndEditWarper';
import ButtonComponent from '@/component/ui/button';
import { useLoading } from '@/context/loadingContext';
import useFetchData from '@/hooks/useFetchData';
import useUpdate from '@/hooks/useUpdate';
import { Checkbox, Col, Collapse, Form, Popover, Row,} from 'antd';
import { useRouter } from 'next/router';
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

const EditSlide = () => {
    const router = useRouter()
    const {slug} = router.query
    const {data} = useFetchData({endpoint : `/api/slide/`,id : slug})
    const { data : language } = useFetchData({endpoint: '/api/language'});
    const { updateById } = useUpdate();
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string>();
    const [activeKeys, setActivekeys] = useState<string[]>([])
    const {isLoading} = useLoading()
   

    const handleFinish = async (values: FieldType) => {
        let image = values['image'] ? values['image'][0]?.response?.filePath  :
        data?.slide?.image
        const payload   = {
        image: image,
        visible: values['visible'],
       translations: Object.keys(values['translations'])
        .filter((key) => 
          language?.language?.filter((byKey : {key : string}) => 
            activeKeys?.includes(byKey.key)).
             some((filteredItem : {_id : string}) => filteredItem._id === key)
          )
          .map((key) => ({
          language: key,
          title: values['translations'][key].title,
          subtitle: values['translations'][key].subtitle,
        })),
        } ;

        try {
            const response = await updateById('/api/slide', slug as string, payload);
            if (response) {
              router.push('/slide');
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
            <div style={{display : 'flex',alignItems : 'center',gap : '1em'}}>
            {
                !imageUrl && 
                <ImageDownLoad
                height={100}
                width={100}
                path={data?.slide?.image}
            />
            }
            <ImageUplaod
              listType="picture-card"
              showList={false}
              formName="image"
              formLabel="Image"
              maxCount={1}
              isRequired={false}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
            
            />
            </div>

            <DynamicForm
              formConfig={[
                {
                  name: 'visible',
                  label: 'Visible',
                  inputType: 'radio',
                  initialValue:  data?.slide?.visible,
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
            
            activeKey={activeKeys}>
            {
                language?.language?.map((lang: { _id: string; key: string; label: string,isMandatory : boolean }) => (
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
                    showArrow={false}>
                    <DynamicForm
                        formConfig={[
                        {
                            name: ['translations', lang._id, 'title'],
                            label: 'Title',
                            inputType: 'input',
                            initialValue  : data?.translations?.find((trans : {language : string}) => trans.language == lang._id)?.title,
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
                            initialValue  : data?.translations?.find((trans : {language : string}) => trans.language == lang._id)?.subtitle,
                            rules: [
                            {
                                required:  lang?.isMandatory  || activeKeys?.includes(lang.key), 
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
            <ButtonComponent type="primary" htmlType="submit" text="Save" />
          </Col>
        </Row>
      </Form>
     }
    </AddAndEditWraper>
  );
};

export default EditSlide;

