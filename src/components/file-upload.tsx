import {Button, Upload, message, Input, InputRef, Progress, Dropdown} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import React, { useRef, useState } from "react";
import { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

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

    const handleUpload = () => {
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
        console.log(fileList, inputRef?.current?.input?.value);
        // fileList.forEach((file) => {
        //     console.log(file, fileList);
        // });
        setUploading(true);
        // You can use any AJAX library you like
        fetch(`https://curly-pants-scream-34-87-61-9.loca.lt/submission?name_solution=${inputRef?.current?.input?.value}`, {
            method: 'POST',
            body: formData,
            headers: {
                "Bypass-Tunnel-Reminder": 'true'
            },
        })
            .then((res) => res.json())
            .then(() => {
                setFileList([]);
                message.success('Submitted successfully.');
            })
            .catch((e) => {
                message.error('Submit failed.');
                console.error('Error while submitting', e)
            })
            .finally(() => {
                setUploading(false);
            });
    };

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