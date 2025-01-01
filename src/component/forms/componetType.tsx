import React from 'react';
import {
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  TimePicker,
  Switch,
  Slider,
  Rate,
  Upload,
  Button,
  InputNumber,
  Tag,
  Image,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea, Password } = Input;
const { RangePicker } = DatePicker;

// Define TypeScript types for formConfig and its items
interface FormItemConfig {
  name: string | number | (string | number)[];
  label?: string;
  inputType: string;
  inputProps?: Record<string, any>;
  options?: { value: string | number; label: string; id?: string }[];
  rules?: Record<string, any>[];
  style?: React.CSSProperties;
  extra?: React.ReactNode;
  initialValue?: any;
  formItemProps?: Record<string, any>;
  conditional?: boolean;
  condition?: boolean;
  uploadText?: string;
}

interface DynamicFormProps {
  formConfig: FormItemConfig[];
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formConfig }) => {
  const renderFormItem = (item: FormItemConfig) => {
    switch (item.inputType) {
      case 'input':
        return <Input {...item.inputProps} />;
      case 'number':
      case 'inputNumber': // Both map to InputNumber
        return <InputNumber style={{ width: '100%' }} {...item.inputProps} />;
      case 'password':
        return <Password {...item.inputProps} />;
      case 'select':
        return (
          <Select {...item.inputProps}>
            {item.options?.map((option) => (
              <Option key={option?.value || option?.id} value={option?.value}>
                {option?.label}
              </Option>
            ))}
          </Select>
        );
      case 'radio':
        return (
          <Radio.Group {...item.inputProps}>
            {item.options?.map((option) => (
              <Radio key={option?.value} value={option?.value}>
                {option?.label}
              </Radio>
            ))}
          </Radio.Group>
        );
      case 'checkbox':
        return (
          <Checkbox.Group {...item.inputProps}>
            {item.options?.map((option) => (
              <Checkbox key={option?.value} value={option?.value}>
                {option?.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      case 'switch':
        return <Switch {...item.inputProps} />;
      case 'datepicker':
        return <DatePicker {...item.inputProps} />;
      case 'rangepicker':
        return <RangePicker {...item.inputProps} />;
      case 'timepicker':
        return <TimePicker {...item.inputProps} />;
      case 'slider':
        return <Slider {...item.inputProps} />;
      case 'textArea':
        return <TextArea {...item.inputProps} />;
      case 'rate':
        return <Rate {...item.inputProps} />;
      case 'image':
        return <Image {...item.inputProps} alt="" />;
      case 'upload':
        return (
          <Upload {...item.inputProps}>
            <Button icon={<UploadOutlined />}>{item.uploadText || 'Upload'}</Button>
          </Upload>
        );
      case 'tag':
        return (
          <Tag
            style={{
              borderStyle: 'dashed',
              minHeight: 35,
              height: 'auto',
              alignContent: 'center',
              textWrap: 'wrap',
              lineHeight: 3,
              width: '100%',
            }}
          >
            {item.initialValue || ''}
          </Tag>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {formConfig.map((item,index) => (
        (item.conditional ? item.condition : true) && (
          <Form.Item
            
            key={index}
            label={item.label}
            name={item.name}
            rules={item.rules}
            extra={item.extra}
            style={{...item.style}}
            initialValue={item.initialValue}
            {...item.formItemProps}
          >
            {renderFormItem(item)}
          </Form.Item>
        )
      ))}
    </>
  );
};

export default DynamicForm;
