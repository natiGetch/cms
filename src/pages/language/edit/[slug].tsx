import DynamicForm from '@/component/forms/componetType';
import AddAndEditWraper from '@/component/layout/addAndEditWarper';
import ButtonComponent from '@/component/ui/button';
import InfoPopOver from '@/component/ui/infoModal';
import { useLoading } from '@/context/loadingContext';
import useFetchData from '@/hooks/useFetchData';
import useUpdate from '@/hooks/useUpdate';
import { singleColumnsLayout } from '@/utils/columnsLayout';
import { Col, Form, Row } from 'antd';
import { useRouter } from 'next/router';
import React from 'react';

type FieldType = {
  label: string;
  key: string;
  vissble: boolean;
};

const EditLanguage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { isLoading } = useLoading();
  const { data } = useFetchData({ endpoint: `/api/language/`, id: slug });
  const { updateById } = useUpdate<FieldType>();
  const [form] = Form.useForm();

  const formConfig = [
    {
      name: 'label',
      label: 'Label',
      inputType: 'input',
      rules: [{ required: true, message: 'Enter language label' }],
      initialValue: data?.language[0]?.label,
    },
    {
      name: 'key',
      label: 'Key',
      inputType: 'input',
      rules: [{ required: true, message: 'Enter Key' }],
      initialValue: data?.language[0]?.key,
    },
    {
      name: 'isMandatory',
      label: 'Mandatory',
      inputType: 'switch',
      initialValue : data?.language[0]?.isMandatory,
      inputProps : {
         style : {
          display : 'flex',
          flexDirection : 'row'
         }
      },
      extra : <InfoPopOver 
          title='If you select this language as mandatory, you will be required to provide content in this language for all relevant sections '/>,
       
   
  },
  
    {
      name: 'visible',
      label: 'Visible',
      inputType: 'radio',
      initialValue: data?.language[0]?.visible,
      extra : <InfoPopOver
      title='If you select this language as visible, it will appear in the dropdown list of available languages for selection.'/>,
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
  ];

  const formSubmit = async (values: FieldType) => {
    try {
      const response = await updateById('/api/language', slug as string, values);
      if (response) {
        form.resetFields();
        router.push('/language');
      }
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };

  return (
    <AddAndEditWraper>
        <Row>
      <Col {...singleColumnsLayout}>
        {!isLoading && (
          <Form
            form={form}
            onFinish={formSubmit}
            layout="vertical"
          >
            <DynamicForm formConfig={formConfig} />
            <ButtonComponent
              type="primary"
              htmlType="submit"
              text="Edit Language"
              props={{
                style: {
                  width: '100%',
                },
              }}
            />
          </Form>
        )}
      </Col>
    </Row>
    </AddAndEditWraper>
  );
};

export default EditLanguage;
