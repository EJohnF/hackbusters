import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Data} from "./data/type";
import {fetchData} from "./data";
import {SubmissionsTable} from "./components/submissions-table";
import {Layout, Spin} from "antd";
import Title from 'antd/es/typography/Title';
import {FileUpload} from "./components/file-upload";

function App() {
  const [data,setData] = useState<Data>()
  useEffect(() => {
    fetchData().then(setData)
  }, [])
  return (
    <div className="App">
        <Title level={2} type={'success'}>Hack Busters</Title>
          <Layout.Content style={{
              margin: '50px auto',
              maxWidth: '850px'
          }}>
              {data ? <SubmissionsTable {...data} /> : <Spin size={'large'}/>}
              <FileUpload />
          </Layout.Content>
    </div>
  );
}

export default App;
