import {Button, Upload, message, Input, InputRef, Progress, Dropdown, Spin} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import React, { useRef, useState } from "react";
import { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import {serverLink} from "../data/server";
import {fetchData} from "../data";

const defaultFiles = [
    {
        key: '1',
        label: 'KNN',
        file: '/example_model.py'
    },
    {
        key: '2',
        label: 'SVM',
        file: '/example_model.py'
    },
    {
        key: '3',
        label: 'Linear regression',
        file: '/example_model.py'
    },
]

const prepareExampleUploadFile = async (filename: string) => {
    const file = await fetch(filename);
    const text = await file.text();
    return new File([text], filename)
}

export const FileUpload = () => {
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [uploading, setUploading] = useState(false);

    const inputRef = useRef<InputRef>(null)

    const handleUpload = async () => {
        if (!inputRef?.current?.input?.value) {
            message.error('Please type in team name');
            return;
        }
        if (!fileList.length) {
            message.error('Please attach file with model');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileList[0] as RcFile);
        setUploading(true);
        // You can use any AJAX library you like
        const initialSubmissions = (await fetchData()).length;
        fetch(`${serverLink}/submission?name_solution=${inputRef?.current?.input?.value}`, {
            method: 'POST',
            body: formData,
            headers: {
                "Bypass-Tunnel-Reminder": 'true'
            },
        })
        let timeoutCounter = 24;
        const interval = setInterval(async () => {
            const numSubmissions = (await fetchData()).length;
            if (numSubmissions > initialSubmissions) {
                setUploading(false);
                clearInterval(interval)
                message.success('Submitted successfully.')
                return;
            }

            timeoutCounter--;
            if (timeoutCounter <= 0) {
                clearInterval(interval);
                setUploading(false);
                message.error('Submit failed.')
            }
        }, 5000)
    };

    if (uploading) return <Spin size={'large'} />

    return (
        <div style={{ display: 'flex', flexDirection: "column", gap: '8px' }}>
            <Title level={3}>Upload your model to compete with others!</Title>
            <div style={{ display: "flex", flexDirection: 'row', gap: '10px' }}>
                <Input ref={inputRef} placeholder={"Team name"} />
                <Button onClick={handleUpload}>Submit</Button>
            </div>
                <Upload {...{
                    beforeUpload: (file) => {
                        setFileList([file]);
                        return false;
                    },
                    onRemove: () => setFileList([]),
                    fileList,
                    maxCount: 1,
                }}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px'}}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    or
                    <Dropdown
                        menu={{
                            items: defaultFiles,
                            onClick: async ({key, domEvent}) => {
                                domEvent.stopPropagation();
                                const file = defaultFiles.find(e => e.key === key)?.file
                                setFileList([(await prepareExampleUploadFile(file!)) as RcFile]);
                            },
                        }}
                        placement="bottomLeft"
                        arrow
                    >
                        <Button onClick={(e) => e.stopPropagation()}>Choose from library</Button>
                    </Dropdown>
                    </div>
                </Upload>
        </div>
    )
}