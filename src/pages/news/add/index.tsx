import DynamicForm from "@/component/forms/componetType";
import AddAndEditWraper from "@/component/layout/addAndEditWarper";
import ButtonComponent from "@/component/ui/button";
import useFetchData from "@/hooks/useFetchData";
import usePost from "@/hooks/usePost";
import { Checkbox, Col, Collapse, Form, message, Popover, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import ImageUpload from "@/component/forms/imageUpload";
type FieldType = {
  publishDate: string;
  visible: boolean
  coverImage : { response?: { filePath: string } }[]; 
  translations: {
    [key: string]: {
      title: string;
      content : string;
      summary : string;
    };
  };
};

const AddNews = () => {
  const { data } = useFetchData({ endpoint: "/api/language" });
  const { handlePost } = usePost();
 
  const [form] = Form.useForm();
  const [contentValue,setContnetValue] = useState<any>()
  const [activeKeys, setActivekeys] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const changeContnetValue =(e : any , langID : string)=>{
    if(e == '<p><br></p>'){
      form.setFieldValue(["translations",langID,'content'],'')
      setContnetValue(e)

    }else{
      setContnetValue(e)
      form.setFieldValue(["translations",langID,'content'],e)
    }
  }
  const handleFinish = async (values: FieldType) => {
    const payload = {
      visible: values["visible"],
      publishDate: values["publishDate"],
      coverImage : values["coverImage"][0]?.response?.filePath,
      translations: Object.keys(values["translations"])
        .filter((key) =>
          data?.language
            ?.filter((byKey: { key: string }) =>
              activeKeys?.includes(byKey.key)
            )
            .some((filteredItem: { _id: string }) => filteredItem._id === key)
        )
        .map((key) => ({
          language: key,
          title: values["translations"][key].title,
          content: values["translations"][key].content,
          summary: values["translations"][key].summary
            
        })),
    };

    const response = await handlePost("/api/news", payload);
    if (response.success) {
      form.resetFields();
      setContnetValue(null)
      setImageUrl(undefined)
    }
  };
  useEffect(() => {
    const mandatoryLanguages = data?.language
      ?.filter((lang: { isMandatory: boolean }) => lang.isMandatory)
      .map((lang: { key: string }) => lang.key);
    setActivekeys(mandatoryLanguages);
  }, [data]);
  
  return (
    <AddAndEditWraper>
      <Form layout="vertical" onFinish={handleFinish} form={form}>
        <Row gutter={[12, 12]}>
          <Col xs={24} lg={7}>
            <DynamicForm
              formConfig={[
              
                {
                  name: "publishDate",
                  label: "Publish date",
                  inputType: "datepicker",
                  rules: [
                    {
                      required: true,
                      message: "Please enter Publish date",
                    },
                  ],
                },
                {
                  name: "visible",
                  label: "Visible",
                  inputType: "radio",
                  initialValue: false,
                  inputProps: {
                    options: [
                      {
                        label: "Visible",
                        value: true,
                      },
                      {
                        label: "Hidden",
                        value: false,
                      },
                    ],
                    optionType: "button",
                    buttonStyle: "solid",
                  },
                },
              ]}
            />
            <ImageUpload
              listType="picture-card"
              showList={false}
              formName="coverImage"
              formLabel="Cover Image"
              maxCount={1}
              isRequired={true}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
            />
          </Col>
          <Col xs={24} lg={17} style={{ maxHeight: "400px", overflow: "auto" }}>
            <Collapse
              activeKey={activeKeys} //
            >
              {data?.language?.map(
                (lang: {
                  _id: string;
                  key: string;
                  label: string;
                  isMandatory: boolean;
                }) => (
                  <Collapse.Panel
                    key={lang.key}
                    header={
                      <div style={{ display: "flex", gap: "1em" }}>
                        {lang.isMandatory ? (
                          <Popover
                            title="Since the languge is mandatory you must add this contnet in this laguage"
                            trigger="click"
                          >
                            <Checkbox checked />
                          </Popover>
                        ) : (
                          <Checkbox
                            onClick={() =>
                              setActivekeys((prevArray) => {
                                if (lang?.key && prevArray.includes(lang.key)) {
                                  return prevArray.filter(
                                    (item) => item !== lang.key
                                  );
                                } else if (lang?.key) {
                                  return [...prevArray, lang.key];
                                }
                                return prevArray;
                              })
                            }
                          />
                        )}
                        {lang.label}
                      </div>
                    }
                    showArrow={false}
                  >
                 
                        <DynamicForm
                          formConfig={[
                            {
                              name: ["translations", lang._id, "title"],
                              label: "Title",
                              inputType: "input",
                              rules: [
                                {
                                  required:
                                    lang.isMandatory ||
                                    activeKeys?.includes(lang.key),
                                  message: "Enter title",
                                },
                              ],
                            },
                            {
                                inputType: 'reactQuill',
                                name:["translations", lang._id, "content"],
                                label:'Content',
                                inputProps: {
                                   value : contentValue,
                                   onBlur: (e: any) => changeContnetValue(e,lang._id),
                                   style: { height: '80%' },
                                   theme: 'snow',

                                   className: 'w-full h-[70%] mt-10 bg-white',
                                 },
                                rules:[{required:true, message:"content is requierd"}]
                            },
                            {
                              name: [
                                "translations",
                                lang._id,
                                "summary",
                              ],
                              label: "Summary",
                              inputType: "textArea",
                              rules: [
                                {
                                  required:
                                    lang.isMandatory ||
                                    activeKeys?.includes(lang.key),
                                  message: "Enter job Description",
                                },
                              ],
                            },
                          ]}
                        />
                      
                  </Collapse.Panel>
                )
              )}
            </Collapse>
          </Col>
          <Col
            span={24}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <ButtonComponent type="primary" htmlType="submit" text="Submit" />
          </Col>
        </Row>
      </Form>
    </AddAndEditWraper>
  );
};

export default AddNews;
