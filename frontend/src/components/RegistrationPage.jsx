import React from 'react';
import RegisterFlat from "./RegisterFlat"
import RegisterOwner from "./RegisterOwner"
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
