import React from 'react';
import { Close } from '@mui/icons-material';
import UploadForm from './UploadForm';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { uploadStyles } from './styles';

interface Props {
    modalOpen: boolean,
    title: string,
    modalClose : (value : boolean) => void; 
}

const UploadModal = (props: Props) => {
    const classes = uploadStyles();

    const handleClose = () => {
        props.modalClose(false)
    }

    return (
        <>
            <Dialog open={props.modalOpen} onClose={handleClose}>
                <DialogTitle className={classes.dialogHeader} >
                    Load {props.title}
                    <IconButton onClick={handleClose} className={classes.closeButton}> <Close /></IconButton>
                </DialogTitle>
                <DialogContent><UploadForm title={props.title} /></DialogContent>
            </Dialog>
        </>
    )
}

export default UploadModal