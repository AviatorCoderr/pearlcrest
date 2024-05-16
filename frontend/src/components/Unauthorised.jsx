import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl text-red-600 mb-4">401 - Not Authorized</h1>
      <p className="text-lg text-center mb-8">
        Oops! It seems you don't have permission to access this page.
      </p>
      <Link to="/log" className="text-blue-500 underline">
        Go back to Login
      </Link>
    </div>
  );
};

export default NotAuthorized;
