import { Button, Link } from "@mui/material";
import React, { useState } from 'react';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

export const GettingStarted = (props: any) => {

    const handleNewInt = (event: React.MouseEvent<HTMLButtonElement>) => {
        vscodeReference.postMessage({
            "command": "ShowNewIntegrationWizard",
        });
    };

    const handleNewDs = (event: React.MouseEvent<HTMLButtonElement>) => {
        vscodeReference.postMessage({
            "command": "ShowNewDataServiceWizard",
        });
    }

    const handleNewDsc = (event: React.MouseEvent<HTMLButtonElement>) => {
        vscodeReference.postMessage({
            "command": "ShowNewDataSourceWizard",
        });
    }

    const handleNewMediator = (event: React.MouseEvent<HTMLButtonElement>) => {
        vscodeReference.postMessage({
            "command": "ShowNewMediatorWizard",
        });
    }

    const showSamples = (event: React.MouseEvent<HTMLButtonElement>) => {
        vscodeReference.postMessage({
            "command": "ShowSampleWizard",
        });
    }

    return (
        <>
            <h3>Getting Started</h3>
            <form noValidate>
                <Button startIcon={<AccountTreeIcon/>} type="submit" variant="text" color="primary" onClick={handleNewInt}>New Integration project</Button>
                <Button startIcon={<HelpCenterIcon/>} type="submit" variant="text" color="primary" onClick={showSamples}>Try out a sample</Button>
            </form>
            <form style={{ position: "absolute", bottom: 5}}>
                <h3>Help</h3>
                <Link href="https://wso2.com/micro-integrator/">Download MI</Link>
                <br/>
                <Link href="https://www.youtube.com/playlist?list=PLp0TUr0bmhX7bdp1li6lz3lVyWYIZsb1z">YouTube Tutorials</Link>
            </form>
        </>
    )
}