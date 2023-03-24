import {Button, Upload, message, Input, InputRef, Progress, Dropdown, Spin, Collapse} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import React, {useEffect, useRef, useState} from "react";
import { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import {serverLink} from "../data/server";
import {fetchData} from "../data";
import {useSubmissions} from "../data/data-context";
import dayjs, {Dayjs} from "dayjs";

const defaultFiles = [
    // {
    //     key: '1',
    //     label: 'mnasnet_small',
    //     file: '/mnasnet_small.py'
    // },
    {
        key: '1',
        label: 'mobilenetv2_050',
        file: '/mobilenetv2_050.py'
    }
]

const prepareExampleUploadFile = async (filename: string) => {
    const file = await fetch(filename);
    const text = await file.text();
    return {
        file: new File([text], filename),
        text,
    }
}

export const FileUpload = () => {
    const [fileList, setFileList] = useState<RcFile[]>([]);
    const [modelText, setModelText] = useState<string>();
    const [uploading, setUploading] = useState(false);

    const submissions = useSubmissions();
    const initialSubmissions = useRef(0)
    const submitTimestamp = useRef<Dayjs>()
    const inputRef = useRef<InputRef>(null)
    const name = useRef<string>();

    useEffect(() => {
        if (submitTimestamp.current) {
            if (submissions.find(e => e.name === name.current)) {
                //    new data came
                submitTimestamp.current = undefined;
                message.success('Submitted successfully.')
                setUploading(false);
            } else {
                if (dayjs().diff(submitTimestamp.current, 'second') > 120) {
                    // waited 2 min and no more data came
                    message.error('Submit failed.')
                    submitTimestamp.current = undefined;
                    setUploading(false);
                }
            }
        }
    }, [submissions])

    const handleUpload = async () => {
        if (!inputRef?.current?.input?.value) {
            message.error('Please type in model name');
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
        initialSubmissions.current = submissions.length;
        submitTimestamp.current = dayjs()
        name.current = inputRef?.current?.input?.value;
        fetch(`${serverLink}/submission?name_solution=${inputRef?.current?.input?.value}`, {
            method: 'POST',
            body: formData,
            headers: {
                "Bypass-Tunnel-Reminder": 'true'
            },
        })
    };

    if (uploading) return <Spin size={'large'} />

    return (
        <div style={{ display: 'flex', flexDirection: "column", gap: '8px' }}>
            <Title level={3}>Upload your model to compete with others!</Title>
            <div style={{ display: "flex", flexDirection: 'row', gap: '10px' }}>
                <Input ref={inputRef} placeholder={"Model name"} />
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
                                const newFile = (await prepareExampleUploadFile(file!))
                                setFileList([newFile.file as RcFile]);
                                setModelText(newFile.text)
                            },
                        }}
                        placement="bottomLeft"
                        arrow
                    >
                        <Button onClick={(e) => e.stopPropagation()}>Choose from library</Button>
                    </Dropdown>
                    </div>
                </Upload>
            {modelText && <Collapse>
                <Collapse.Panel header="Model source code" key="1">
                    <pre style={{textAlign: 'left'}}>{modelText}</pre>
                </Collapse.Panel>
            </Collapse>}
        </div>
    )
}