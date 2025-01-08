import React, { Suspense, useMemo, useRef, useState} from "react";
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
  Spin,
} from "antd";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
import { UploadOutlined } from "@ant-design/icons";


const { Option } = Select;
const { TextArea, Password } = Input;
const { RangePicker } = DatePicker;


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
  className?: string;
}

interface DynamicFormProps {
  formConfig: FormItemConfig[];
}



const DynamicForm: React.FC<DynamicFormProps> = ({ formConfig }) => {
  const joditEditor = useRef<any>(null); 
  const config = useMemo(() => ({
    readonly: false,
    placeholder: "Start typing...",
    uploader: {
      insertImageAsBase64URI: false, 
      url: '/api/uploadImage', 
      format: 'json',
      method: 'POST',
      isSuccess: (resp : any) => !resp.error,
      prepareData: function (formData : any) {
          formData.append('mode', "My Files"); 
          formData.append("name", 'image')
          formData.append("image", formData.get('files[0]'))
          formData.delete("files[0]")
          return formData
      },
      process : (resp : any)=> ({
        files: [resp.filePath], 
        path: resp.filePath,
        baseurl: resp.filePath,
        error: resp.error ? 1 : 0, 
      }),
      defaultHandlerSuccess: (resp : any) => {
          const [tagName, attr] = ['img', 'src']
          const elm = joditEditor.current.createInside.element(tagName)
          const baseurl = `${process.env.NEXT_PUBLIC_FILE_URL}${resp.baseurl}`
          elm.setAttribute(attr,baseurl);
          joditEditor.current.selection.insertImage(elm, null, resp.files[0].width);
      }
  }
  
  }), []);


  const renderFormItem = (item: FormItemConfig) => {
    switch (item.inputType) {
      case "input":
        return <Input {...item.inputProps} />;
      case "number":
      case "inputNumber": 
        return <InputNumber style={{ width: "100%" }} {...item.inputProps} />;
      case "password":
        return <Password {...item.inputProps} />;
      case "select":
        return (
          <Select {...item.inputProps}>
            {item.options?.map((option) => (
              <Option key={option?.value || option?.id} value={option?.value}>
                {option?.label}
              </Option>
            ))}
          </Select>
        );
      case "radio":
        return (
          <Radio.Group {...item.inputProps}>
            {item.options?.map((option) => (
              <Radio key={option?.value} value={option?.value}>
                {option?.label}
              </Radio>
            ))}
          </Radio.Group>
        );
      case "checkbox":
        return (
          <Checkbox.Group {...item.inputProps}>
            {item.options?.map((option) => (
              <Checkbox key={option?.value} value={option?.value}>
                {option?.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
      case "switch":
        return <Switch {...item.inputProps} />;
      case "datepicker":
        return <DatePicker {...item.inputProps} />;
      case "rangepicker":
        return <RangePicker {...item.inputProps} />;
      case "timepicker":
        return <TimePicker {...item.inputProps} />;
      case "slider":
        return <Slider {...item.inputProps} />;
      case "textArea":
        return <TextArea {...item.inputProps} />;
      case "rate":
        return <Rate {...item.inputProps} />;
      case "image":
        return <Image {...item.inputProps} alt="" />;
      case "upload":
        return (
          <Upload {...item.inputProps}>
            <Button icon={<UploadOutlined />}>
              {item.uploadText || "Upload"}
            </Button>
          </Upload>
        );
      case "tag":
        return (
          <Tag
            style={{
              borderStyle: "dashed",
              minHeight: 35,
              height: "auto",
              alignContent: "center",
              textWrap: "wrap",
              lineHeight: 3,
              width: "100%",
            }}
          >
            {item.initialValue || ""}
          </Tag>
        );
      case "reactQuill":
        return (
          <Suspense fallback={<Spin />}>
           <JoditEditor
              ref={joditEditor}
              editorRef={(ref : any) => joditEditor.current = ref}
              config={config}
              {...item.inputProps}
              
            />
        </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {formConfig.map(
        (item, index) =>
          (item.conditional ? item.condition : true) && (
            <Form.Item
              key={index}
              label={item.label}
              name={item.name}
              rules={item.rules}
              extra={item.extra}
              style={{ ...item.style }}
              initialValue={item.initialValue}
              {...item.formItemProps}
              className={`${item.extra ? "with-extra" : ""}`}
            >
              {renderFormItem(item)}
            </Form.Item>
          )
      )}
    </>
  );
};

export default DynamicForm;
