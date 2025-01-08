import React from 'react';
import type { FormProps } from 'antd';
import { Button, Card, Form, Input, Spin } from 'antd';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import usePost from '../hooks/usePost'; // Import usePost hook
import { useLoading } from '@/context/loadingContext';

type FieldType = {
  userName?: string;
  password?: string;
};

const Login: React.FC = () => {
  const router = useRouter(); // Initialize useRouter hook inside the component
  const { handlePost } = usePost(); // Use the usePost hook to get the handlePost function
  const {isLoading} =  useLoading()
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const res = await handlePost('/api/login', values); // Use handlePost from the custom hook

    if (res.success) {
      router.push('/dashboard');
    } else {
     
      console.error(res.error); // Optionally log the error
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f2f2f2',
      }}
    >
      <Spin spinning={isLoading} fullscreen/>
      <Card>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="userName"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
