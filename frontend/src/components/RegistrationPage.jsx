import React from 'react';
import RegisterFlat from "./components/RegisterFlat"
import RegisterOwner from "./components/RegisterOwner"
const RegistrationPage = () => {
    return (
        <div className="grid grid-cols-2 gap-8">
            <div>
                <RegisterFlat />
            </div>
            <div>
                <RegisterOwner />
            </div>
        </div>
    );
};

export default RegistrationPage;
