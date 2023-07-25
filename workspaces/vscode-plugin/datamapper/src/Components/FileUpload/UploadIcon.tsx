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

import React from 'react'
import { Button } from '@mui/material'
import { uploadStyles } from './styles';
import { AddCircleRounded } from '@mui/icons-material';
import UploadModal from './UploadModal';

// Navbar with upload options
const UploadIcon = () => {
    const classes = uploadStyles();
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const NodeTitle = ['Input', 'Output'];

    const handleClose = (value: boolean) => {
        setOpen(value);
    }

    return (
        <>
            <div className={classes.header} >
                {NodeTitle.map((node, index) => {
                    return (
                        <Button key={index} sx={{ color: '#c0c0c0', fontFamily: 'monospace' }}
                            onClick={() => { setTitle(node); setOpen(true); }}
                            startIcon={<AddCircleRounded fontSize="small" />}>Load {node}</Button>)
                })}
            </div>
            <UploadModal title={title} modalOpen={open} modalClose={handleClose} />
        </>
    )
}

export default UploadIcon;
