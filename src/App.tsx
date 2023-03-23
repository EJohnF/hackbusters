import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Data, Submission} from "./data/type";
import {fetchData} from "./data";
import {SubmissionsTable} from "./components/submissions-table";
import {Layout, Spin} from "antd";
import Title from 'antd/es/typography/Title';
import {FileUpload} from "./components/file-upload";
import Charts from './components/charts'

function App() {
  const [data,setData] = useState<Submission[]>()
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
              <Charts />
              {data ? <SubmissionsTable submissions={data} numberOfRuns={100} /> : <Spin size={'large'}/>}
              <FileUpload />
          </Layout.Content>
    </div>
  );
}

export default App;
