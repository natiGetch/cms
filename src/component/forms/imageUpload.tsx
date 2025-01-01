import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload, Form } from 'antd';
import type { UploadProps } from 'antd';
import { UploadListType } from 'antd/es/upload/interface';

type FileType = Parameters<Required<UploadProps>['beforeUpload']>[0];
type ImageUploadType = {
  maxCount: number;
  showList: boolean;
  listType: UploadListType;
  formLabel: string;
  formName: string;
  isRequired : boolean,
  imageUrl : string | undefined
  setImageUrl : (imageUrl : string)  => void
};

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const ImageUpload: React.FC<ImageUploadType> = ({
  maxCount,
  showList,
  listType,
  formLabel,
  formName,
  isRequired,
  imageUrl,
  setImageUrl,
}) => {
  const [loading, setLoading] = useState(false);
  

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Form.Item
      name={formName}
      label={formLabel}
      valuePropName="fileList"
      getValueFromEvent={normFile}
      rules={[{required : isRequired,message : 'Uplaod Image'}]}
    >
      <Upload
        name="image"
        listType={listType}
        showUploadList={showList}
        action="http://localhost:3000/api/uploadImage"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        maxCount={maxCount}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    </Form.Item>
  );
};

export default ImageUpload;
