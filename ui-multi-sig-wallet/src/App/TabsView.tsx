import { Tabs } from 'antd';
import React from 'react';
import AllTrasaction from "./components/AllTransaction";
import AllPendingTransaction from "./components/AllPendingTransaction";
import AllExcutedTransaction from "./components/AllExcutedTransaction";
import AllCancelTransaction from "./components/AllCancelTransaction";
const { TabPane } = Tabs;

const onChange = (key: string) => {
};

const TabsView = () => (
    <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="All" key="1">
            <AllTrasaction />
        </TabPane>
        <TabPane tab="Pending" key="2">
            <AllPendingTransaction />
        </TabPane>
        <TabPane tab="Excuted" key="3">
            <AllExcutedTransaction />
        </TabPane>
        <TabPane tab="Cancel" key="4">
           <AllCancelTransaction />
        </TabPane>
    </Tabs>
);

export default TabsView;
