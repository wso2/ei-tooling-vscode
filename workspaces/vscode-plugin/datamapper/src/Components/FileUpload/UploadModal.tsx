/**
 * Copyright (c) 2023, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

import React from 'react';
import { Close, Pending } from '@mui/icons-material';
import UploadForm from './UploadForm';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { uploadStyles } from './styles';

interface Props {
    modalOpen: boolean,
    title: string,
    modalClose: (value: boolean) => void;
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

export default UploadModal;
