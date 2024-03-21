import React from "react";
import Dashboardstatsgrid from "./Dashboardstatsgrid";
import Transactionchart from "./Transactionchart";
import Vistorslistdash from "./Vistorslistdash";
import RecentTransaction from "./RecentTransaction";
import Complaintsdash from "./Complaintsdash";
export default function Dashboard() {
    return (
        <div className="flex flex-col gap-4">
            <Dashboardstatsgrid />
            <div className="flex flex-row gap-4 w-full">
            <Transactionchart />
            <Vistorslistdash />
            </div>
            <div className="flex flex-row gap-4 w-full">
                <RecentTransaction />
                <Complaintsdash />
            </div>
        </div>
    )
}