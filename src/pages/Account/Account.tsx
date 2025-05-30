import React, {useState} from 'react';
import UserForm from '../../components/InforUserForm/UserForm';



export default function Account() {

    return (
        <>

            <div className="container" style={{ marginTop: '5%' }}>
                <div className="flex justify-center items-center">
                    <UserForm/>
                </div>
            </div>
        </>
    );
};

