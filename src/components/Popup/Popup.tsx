import React, {useState} from 'react';
import {Button, Modal} from 'antd';

export default function Popup(props: any) {
    const [open, setOpen] = useState(false);

    // Mở modal
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <div className="mx-auto">

            <Button className="btn btn-custom" onClick={showModal}>
                {props.btnText}
            </Button>
            <Modal title={props.title}   footer={null}  open={open} onOk={handleOk} onCancel={handleCancel}>
                <div>{props.content}</div>
            </Modal>
        </div>
    );
}

