import {Button, Upload, message, Input} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import React from "react";
import {UploadProps} from "antd/es/upload/interface";

const props: UploadProps = {
    headers: {
        "Bypass-Tunnel-Reminder": 'true'
    },
    action: 'https://nine-items-sniff-34-145-225-193.loca.lt/submission',
    name: 'file',
    method: 'POST',
    // customRequest: ({onSuccess}) =>
    // @ts-ignore
    onChange(info) {
        console.log(info)
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};


export const FileUpload = () => {
    return (
        <div style={{display: 'flex', flexDirection: "column", gap: '8px'}}>
            <Title level={3}>Upload your model to compete with others!</Title>
            <div style={{display: "flex", flexDirection: 'row', gap: '10px'}}>
                <Input placeholder={"Team name"}/>
                <Button onClick={() => message.info('Submitted')}>Submit</Button>
            </div>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
        </div>
    )
}