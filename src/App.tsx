import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Data, Submission } from "./data/type";
import { fetchData } from "./data";
import { SubmissionsTable } from "./components/submissions-table";
import { Layout, Spin } from "antd";
import Title from 'antd/es/typography/Title';
import { FileUpload } from "./components/file-upload";
import Charts from './components/charts'
import { DataContext } from "./data/data-context";

function App() {
  const [data, setData] = useState<Submission[]>([
    {
      name: 'model_2',
      accuracy: 0.88,
      emissions: 0.0004044858792713,
      score: +(0.88 / 0.0004044858792713).toFixed(3),
      cpu_model: 'Intel(R) Xeon(R) CPU @ 2.20GHz',
      gpu_model: '1 x Tesla T4'
    },
    {
      name: 'model_3',
      accuracy: 0.9335031847133758,
      emissions: 0.0014040720193948,
      score: +(0.9335031847133758 / 0.0014040720193948).toFixed(3),
      cpu_model: 'Intel(R) Xeon(R) CPU @ 2.20GHz',
      gpu_model: '1 x Tesla T4'
    },
    {
      name: 'model_4',
      accuracy: 0.9031847133757962,
      emissions: 0.0006148717493697,
      score: +(0.9031847133757962 / 0.0006148717493697).toFixed(3),
      cpu_model: 'Intel(R) Xeon(R) CPU @ 2.20GHz',
      gpu_model: '1 x Tesla T4'
    }])

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData().then((newData) => setData([...newData])).finally(() => setLoading(false))
    }, 5000);
    return () => {
      clearInterval(interval);
    }
  }, [])
  return (
    <div className="App">
      <DataContext.Provider value={{ submissions: data }}>
        <Title level={2} type={'success'}>E.mission</Title>
        <Layout.Content style={{
          margin: '50px auto',
          maxWidth: '850px'
        }}>
          {loading ? <Spin size={'large'} />: <><Charts /><SubmissionsTable /></>}
          <FileUpload />
        </Layout.Content>
      </DataContext.Provider>
    </div>
  );
}

export default App;
