import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const DetailModal = ({ isOpen, handleClose, amount, date, dis, type }) => {
    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    width: 400,
                    backgroundColor: 'black',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 2,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '10px',
                    color: 'white',
                    fontFamily: 'monospace',
                }}
            >
                <Typography variant="h6" component="div" style={{ textAlign: 'center', marginBottom: '15px' }}>
                    ₹{amount}
                </Typography>
                <div style={{ display: 'flex', textAlign: 'center', backgroundColor: 'rgb(48, 44, 44)', borderRadius: '10px 10px 0 0' }}>
                    <span style={{ marginLeft: '5%', padding: '10px', paddingTop: '13px', overflow: 'auto', color: 'white' }}>Date :</span>
                    <span style={{ marginLeft: '5%', padding: '10px', paddingTop: '13px', overflow: 'auto', color: 'white' }}>{date}</span>
                </div>
                <div style={{ display: 'flex', textAlign: 'center', backgroundColor: 'rgb(48, 44, 44)', borderRadius: '0' }}>
                    <span style={{ marginLeft: '5%', padding: '10px', paddingTop: '13px', overflow: 'auto' }}>Description :</span>
                    <span style={{ marginLeft: '5%', padding: '10px', paddingTop: '13px', overflow: 'auto' }}>{dis}</span>
                </div>
                <div style={{ display: 'flex', textAlign: 'center', paddingBottom: '15px', borderRadius: '0 0 10px 10px', backgroundColor: 'gray' }}>
                    <span style={{ marginLeft: '5%', padding: '10px', paddingTop: '13px', overflow: 'auto' }}>Type :</span>
                    <span style={{ marginLeft: '5%', padding: '10px', paddingTop: '13px', overflow: 'auto' }}>{type}</span>
                </div>
            </Box>
        </Modal>
    );
};

export default DetailModal;
