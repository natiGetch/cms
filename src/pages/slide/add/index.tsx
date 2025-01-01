import DynamicForm from '@/component/forms/componetType';
import ImageUplaod from '@/component/forms/imageUpload';
import AddAndEditWraper from '@/component/layout/addAndEditWarper';
import ButtonComponent from '@/component/ui/button';
import useFetchData from '@/hooks/useFetchData';
import usePost from '@/hooks/usePost';
import { Checkbox, Col, Collapse, Form, Row,} from 'antd';
import React, { useState } from 'react';

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
  const [tabsState, setTabsState] = useState<{ [key: string]: boolean }>({});

  const handleCheckboxChange = (langId: string, checked: boolean) => {
    setTabsState((prev) => ({ ...prev, [langId]: checked }));
  };

  const handleFinish = async (values: FieldType) => {
    const payload = {
      image: values['image'][0]?.response?.filePath,
      visible: values['visible'],
      translations: Object.keys(values['translations'])
        .filter((key) => values['translations'][key]?.enabled)
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
      setTabsState({});
    }
  };

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
          <Col xs={24} sm={18}>
          <Collapse>
  {data?.language?.map((lang: { _id: string; key: string; label: string }) => (
    <Collapse.Panel
      key={lang.key}
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Form.Item
            name={['translations', lang._id, 'enabled']}
            valuePropName="checked"
            initialValue={false}
            style={{ marginBottom: 0 }}
          >
            <Checkbox />
          </Form.Item>
          {lang.label}
        </div>
      }
      collapsible={!tabsState[lang._id] ? 'disabled' : undefined}
    >
          <DynamicForm
            formConfig={[
              {
                name: ['translations', lang._id, 'title'],
                label: 'Title',
                inputType: 'input',
                rules: [
                  ({ getFieldValue } : any) => ({
                    required: getFieldValue(['translations', lang._id, 'enabled']),
                    message: 'Enter Title',
                  }),
                ],
              },
              {
                name: ['translations', lang._id, 'subtitle'],
                label: 'Subtitle',
                inputType: 'textArea',
                rules: [
                  ({ getFieldValue } : any) => ({
                    required: getFieldValue(['translations', lang._id, 'enabled']),
                    message: 'Enter Subtitle',
                  }),
                ],
              },
            ]}
          />
        </Collapse.Panel>
      ))}
   </Collapse>

          </Col>
          <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ButtonComponent type="primary" htmlType="submit" text="Add Language" />
          </Col>
        </Row>
      </Form>
    </AddAndEditWraper>
  );
};

export default AddSlide;

