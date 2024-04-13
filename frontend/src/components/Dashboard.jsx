import React from "react";
import Dashboardstatsgrid from "./Dashboardstatsgrid";
import Transactionchart from "./Transactionchart";
import Vistorslistdash from "./Vistorslistdash";
import RecentTransaction from "./RecentTransaction";
import Complaintsdash from "./Complaintsdash";

export default function Dashboard() {
    return (
        <div className="grid grid-cols-1 gap-4 overflow-y-scroll lg:overflow-y-auto w-full h-full">
            <Dashboardstatsgrid />
            <div className="flex gap-4 w-full">
                <Transactionchart className="m-auto flex-1"/>
                <Vistorslistdash className="m-auto flex-1"/>
            </div>
            <div className="flex flex-row gap-4 w-full">
                <RecentTransaction />
                <Complaintsdash />
            </div>
        </div>
    );
}
