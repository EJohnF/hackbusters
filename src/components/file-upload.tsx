import { Button, Upload, message, Input, InputRef } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import React, { useRef, useState } from "react";
import { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

export const FileUpload = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);

    const inputRef = useRef<InputRef>(null)
    const props: UploadProps = {
        // @ts-ignore
        onChange(info) {
            console.log(info)
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed`);
            }
        },
        beforeUpload: (file) => {
            setFileList([file]);
            return false;
        },
        fileList,
    };

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
        fetch(`https://nine-items-sniff-34-145-225-193.loca.lt/submission?name_solution=${inputRef?.current?.input?.value}`, {
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
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
        </div>
    )
}