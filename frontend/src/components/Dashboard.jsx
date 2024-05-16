import React from "react";
import Dashboardstatsgrid from "./Dashboardstatsgrid";
import Vistorslistdash from "./Vistorslistdash";
import RecentTransaction from "./RecentTransaction";
import MaidLog from "./MaidLogs";
export default function Dashboard() {
    return (
        <div className="flex flex-col overflow-visible md:grid md:grid-cols-1 gap-4 md:w-full h-full">
            <Dashboardstatsgrid />
            <div className="flex flex-col md:flex-row gap-4 w-full">
                <Vistorslistdash className="m-auto md:flex-1"/>
            </div>
            <div className="grid gap-4 w-full">
                <RecentTransaction />
                <MaidLog />
            </div>
        </div>
    );
}
