import DynamicForm from "@/component/forms/componetType";
import FormListComponet from "@/component/forms/formList";
import AddAndEditWraper from "@/component/layout/addAndEditWarper";
import ButtonComponent from "@/component/ui/button";
import useFetchData from "@/hooks/useFetchData";
import usePost from "@/hooks/usePost";
import { Checkbox, Col, Collapse, Form, message, Popover, Row } from "antd";
import React, { useEffect, useState } from "react";

type FieldType = {
  applyLink: string;
  deadLine: string;
  visible: boolean;
  translations: {
    [key: string]: {
      title: string;
      jobDescription: string;
      location: string[];
      responsibilities: string[];
      experience: string[];
      qualifications: string[];
    };
  };
};

const AddVacancy = () => {
  const { data } = useFetchData({ endpoint: "/api/language" });
  const { handlePost } = usePost();
  const [form] = Form.useForm();
  const [activeKeys, setActivekeys] = useState<string[]>([]);
  const handleFinish = async (values: FieldType) => {
    const payload = {
      visible: values["visible"],
      applyLink: values["applyLink"],
      deadLine: values["deadLine"],
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
          jobDescription: values["translations"][key].jobDescription,
          location: values["translations"][key].location
            ?.flat()
            ?.filter((item) => item !== undefined),
          responsibilities: values["translations"][key].responsibilities
            ?.flat()
            ?.filter((item) => item !== undefined),
          experience: values["translations"][key].experience
            ?.flat()
            ?.filter((item) => item !== undefined),
          qualifications: values["translations"][key].qualifications
            ?.flat()
            ?.filter((item) => item !== undefined),
        })),
    };

    const response = await handlePost("/api/vacancy", payload);
    if (response.success) {
      form.resetFields();
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
                  name: "applyLink",
                  label: "Link",
                  inputType: "input",
                  rules: [
                    {
                      required: true,
                      message: "Please enter Link",
                    },
                  ],
                },
                {
                  name: "deadLine",
                  label: "Deadline",
                  inputType: "datepicker",
                  rules: [
                    {
                      required: true,
                      message: "Please enter DeadLine",
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
          </Col>
          <Col xs={24} lg={17} style={{ maxHeight: "460px", overflow: "auto" }}>
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
                    <Row justify="space-between">
                      <Col xs={24} lg={10}>
                        <DynamicForm
                          formConfig={[
                            {
                              name: ["translations", lang._id, "title"],
                              label: "Job Title",
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
                              name: [
                                "translations",
                                lang._id,
                                "jobDescription",
                              ],
                              label: "Job Description",
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
                        <FormListComponet
                          name={["translations", lang._id, "location"]}
                          formConfig={{
                            inputType: "input",
                            label: "Location",
                            rules: [
                              {
                                required: true,
                                message: "Please input location",
                              },
                            ],
                          }}
                        />
                      </Col>
                      <Col xs={24} lg={10}>
                        <FormListComponet
                          name={["translations", lang._id, "responsibilities"]}
                          formConfig={{
                            inputType: "input",
                            label: "Responsibilities",
                            rules: [
                              {
                                required: true,
                                message: "Please input responsibilities",
                              },
                            ],
                          }}
                        />
                        <FormListComponet
                          name={["translations", lang._id, "experience"]}
                          formConfig={{
                            inputType: "input",
                            label: "Experience",
                            rules: [
                              {
                                required: true,
                                message: "Please input experience",
                              },
                            ],
                          }}
                        />
                        <FormListComponet
                          name={["translations", lang._id, "qualifications"]}
                          formConfig={{
                            inputType: "input",
                            label: "Qualifications",
                            rules: [
                              {
                                required: true,
                                message: "Please input qualifications",
                              },
                            ],
                          }}
                        />
                      </Col>
                    </Row>
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

export default AddVacancy;
