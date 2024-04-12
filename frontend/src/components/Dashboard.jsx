import React from "react";
import Dashboardstatsgrid from "./Dashboardstatsgrid";
import Transactionchart from "./Transactionchart";
import Vistorslistdash from "./Vistorslistdash";
import RecentTransaction from "./RecentTransaction";
import Complaintsdash from "./Complaintsdash";

export default function Dashboard() {
    return (
        <div className="overflow-y-auto h-full">
            <div className="relative flex flex-col gap-4 overflow-y-scroll lg:overflow-y-auto h-full">
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
        </div>
    );
}
