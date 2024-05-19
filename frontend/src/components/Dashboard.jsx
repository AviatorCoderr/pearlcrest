import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { requestPermission, getToken, onMessageListener } from '../firebase'; // Ensure correct path to firebase.js
import Dashboardstatsgrid from './Dashboardstatsgrid';
import VisitorsListDash from './Vistorslistdash';
import RecentTransaction from './RecentTransaction';
import MaidLog from './MaidLogs';

const Dashboard = () => {
  const [isTokenFound, setTokenFound] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      await requestPermission();
      await getToken(setTokenFound);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (isTokenFound) {
      console.log('Token is found!');
    } else {
      console.log('Token is not found!');
    }
  }, [isTokenFound]);

  useEffect(() => {
    onMessageListener()
      .then(payload => {
        console.log('Received foreground message: ', payload);
        // Handle the foreground message here
      })
      .catch(err => console.log('failed: ', err));
  }, []);

  return (
    <div className="flex flex-col overflow-visible md:grid md:grid-cols-1 gap-4 md:w-full h-full">
      <Dashboardstatsgrid />
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <VisitorsListDash className="m-auto md:flex-1" />
      </div>
      <div className="grid gap-4 w-full">
        <RecentTransaction />
        <MaidLog />
      </div>
    </div>
  );
};

export default Dashboard;
