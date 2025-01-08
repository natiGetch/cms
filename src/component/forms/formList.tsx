import React from 'react';
import { Form, Row, Col, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import DynamicForm from './componetType'; // Assuming DynamicForm is your generic form renderer

const FormListComponet = ({ name, formConfig,initialListValue = [''] }: { name: string[], formConfig: any, initialListValue? : any[] }) => {
 
  return (
    <Form.List
      name={name}
      initialValue={initialListValue} 
      
    >
      {(fields, { add, remove }) => (
        
        <>
         
          {fields.map((field, index) => (
            
              <Row gutter={6} align='middle'>
                <Col span={20}>
                  <DynamicForm
                    formConfig={[
                      {
                        name: [field.name, field.key], 
                        ...formConfig,
                        initialValue : initialListValue[index]
                      },
                    ]}
                  />
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                {fields.length > 1 && index > 0 &&
                    (<MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  )}
                  <PlusOutlined
                    className="dynamic-add-button"
                    onClick={() => add()}
                  />
                </Col>
              </Row>
           
          ))}
        </>
      )}
    </Form.List>
  );
};

export default FormListComponet;
