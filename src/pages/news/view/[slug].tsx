import DynamicForm from '@/component/forms/componetType'
import ImageDownLoad from '@/component/forms/imageDownLoad'
import ViewDetailwraper from '@/component/layout/ViewDetailWarper'
import useFetchData from '@/hooks/useFetchData'
import { centerdColumnsLayout, singleColumnsLayout, twoColumnLaout } from '@/utils/columnsLayout'
import { GlobalOutlined } from '@ant-design/icons'
import { Card, Row, Col, Tabs, Tag, Form, Flex, TabsProps, Select } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const ViewNewsDetail = () => {
    const router = useRouter()
    const { slug } = router.query
    const { data } = useFetchData({ endpoint: `/api/news/`, id: slug })
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
            key: 'news',
            label: 'News',
            children: (
                <Row gutter={[64, 0]}>
                    <Col {...twoColumnLaout}>
                        <DynamicForm
                            formConfig={[
                                {
                                  name: "publishDate",
                                  label: "Publish date",
                                  inputType: 'tag',
                                  initialValue: data?.news?.publishDate
                                },
                                {
                                    name: 'visible',
                                    label: 'Visible',
                                    inputType: 'tag',
                                    initialValue: data?.news?.visible ? <Tag color="green">Visible</Tag> :
                                        <Tag color="red">Hidden</Tag>,
                                },
                            ]}
                        />
                          <ImageDownLoad
                            height={155}
                            width={150}
                            path={data?.news?.coverImage}/>
                    </Col>
                    <Col {...twoColumnLaout}>
                        <DynamicForm
                            formConfig={[
                                {
                                    name: 'createdBy',
                                    label: 'Created by',
                                    inputType: 'tag',
                                    initialValue: data?.news?.createdBy
                                },
                                {
                                    name: 'createdAt',
                                    label: 'Created at',
                                    inputType: 'tag',
                                    initialValue: data?.news?.createdAt
                                },
                                {
                                    name: 'updatedBy',
                                    label: 'Updated by',
                                    inputType: 'tag',
                                    initialValue: data?.news?.updatedBy
                                },
                                {
                                    name: 'updatedAt',
                                    label: 'Updated at',
                                    inputType: 'tag',
                                    initialValue: data?.news?.updatedAt
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
                                                        name: 'summary',
                                                        label: "Summary",
                                                        inputType: 'tag',
                                                        initialValue: translation?.summary,
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
                        defaultActiveKey="news"
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

export default ViewNewsDetail
