import DynamicForm from '@/component/forms/componetType'
import ImageDownLoad from '@/component/forms/imageDownLoad'
import ViewDetailwraper from '@/component/layout/ViewDetailWarper'
import useFetchData from '@/hooks/useFetchData'
import { centerdColumnsLayout, singleColumnsLayout, twoColumnLaout } from '@/utils/columnsLayout'
import { GlobalOutlined } from '@ant-design/icons'
import { Card, Row, Col, Tabs, Tag, Form, Flex, TabsProps, Select } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const ViewVacancy = () => {
    const router = useRouter()
    const { slug } = router.query
    const { data } = useFetchData({ endpoint: `/api/vacancy/`, id: slug })
    const { data: language } = useFetchData({ endpoint: '/api/language' });
    const [selectedLanguage, setSelectedLanguage] = useState<string>()

    useEffect(() => {
        const assignLanguage = () => {
            const firstFilteredLanguageId = language?.language
                ?.filter((lang: { _id: string }) =>
                    data?.translations?.some((translation: any) => translation.language === lang._id)
                )?.[0]?._id;
            setSelectedLanguage(firstFilteredLanguageId);
        };
        assignLanguage();
    }, [language, data]);

    const ParentTabItems: TabsProps['items'] = [
        {
            key: 'vacancy',
            label: 'Vacancy',
            children: (
                <Row gutter={[64, 0]}>
                    <Col {...twoColumnLaout}>
                        <DynamicForm
                            formConfig={[
                                {
                                    name: 'deadLine',
                                    label: 'Deadline',
                                    inputType: 'tag',
                                    initialValue: data?.vacancy?.deadLine
                                },
                                {
                                    name: 'applyLink',
                                    label: 'Link',
                                    inputType: 'tag',
                                    initialValue: data?.vacancy?.applyLink
                                },
                                {
                                    name: 'visible',
                                    label: 'Visible',
                                    inputType: 'tag',
                                    initialValue: data?.vacancy?.visible ? <Tag color="green">Visible</Tag> :
                                        <Tag color="red">Hidden</Tag>,
                                },
                            ]}
                        />
                    </Col>
                    <Col {...twoColumnLaout}>
                        <DynamicForm
                            formConfig={[
                                {
                                    name: 'createdBy',
                                    label: 'Created by',
                                    inputType: 'tag',
                                    initialValue: data?.vacancy?.createdBy
                                },
                                {
                                    name: 'createdAt',
                                    label: 'Created at',
                                    inputType: 'tag',
                                    initialValue: data?.vacancy?.createdAt
                                },
                                {
                                    name: 'updatedBy',
                                    label: 'Updated by',
                                    inputType: 'tag',
                                    initialValue: data?.vacancy?.updatedBy
                                },
                                {
                                    name: 'updatedAt',
                                    label: 'Updated at',
                                    inputType: 'tag',
                                    initialValue: data?.vacancy?.updatedAt
                                },
                            ]}
                        />
                    </Col>
                </Row>
            )
        },
        {
            key: 'translation',
            label: 'Translation',
            children: (
                <Row gutter={[64, 0]}>
                    {selectedLanguage && (
                        <>
                            {(() => {
                                const translation = data?.translations?.find(
                                    (translation: any) => translation.language === selectedLanguage
                                );
                                return (
                                    <>
                                        <Col {...twoColumnLaout}>
                                            <DynamicForm
                                                formConfig={[
                                                    {
                                                        name: 'title',
                                                        label: 'Title',
                                                        inputType: 'tag',
                                                        initialValue: translation?.title,
                                                    },
                                                    {
                                                        name: 'jobDescription',
                                                        label: 'Job Description',
                                                        inputType: 'tag',
                                                        initialValue: translation?.jobDescription,
                                                    },
                                                    {
                                                        name: 'location',
                                                        label: 'Location',
                                                        inputType: 'tag',
                                                        initialValue: translation?.location,
                                                    },
                                                ]}
                                            />
                                        </Col>
                                        <Col {...twoColumnLaout}>
                                            <DynamicForm
                                                formConfig={[
                                                    {
                                                        name: 'responsibilities',
                                                        label: 'Responsibilities',
                                                        inputType: 'tag',
                                                        initialValue: translation?.responsibilities,
                                                    },
                                                    {
                                                        name: 'qualifications',
                                                        label: 'Qualifications',
                                                        inputType: 'tag',
                                                        initialValue: translation?.qualifications,
                                                    },
                                                    {
                                                        name: 'experience',
                                                        label: 'Experience',
                                                        inputType: 'tag',
                                                        initialValue: translation?.experience,
                                                    },
                                                ]}
                                            />
                                        </Col>
                                    </>
                                );
                            })()}
                        </>
                    )}
                </Row>
            )
        }
    ];

    return (
        <ViewDetailwraper>
            <Form layout='vertical'>
                <Card>
                    <Tabs
                        defaultActiveKey="vacancy"
                        items={ParentTabItems}
                        type="card"
                        tabBarExtraContent={
                            <Select
                                suffixIcon={<GlobalOutlined />}
                                value={selectedLanguage}
                                onChange={setSelectedLanguage}
                                options={
                                    language?.language
                                        ?.filter((lang: { _id: string }) =>
                                            data?.translations?.some((translation: any) => translation.language === lang._id)
                                        ).map((lang: { _id: string; key: string; label: string }) => {
                                            return {
                                                value: lang._id,
                                                label: lang.label
                                            }
                                        })
                                }
                            />
                        }
                    />
                </Card>
            </Form>
        </ViewDetailwraper>
    )
}

export default ViewVacancy
