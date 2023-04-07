import React from "react";
import { Diagram } from "../Diagram";
import { Editor } from "../Editor";

import './style.css';

export function Home() {

    return (
        <>
            <h1>Diagram Sample Test</h1>
            <div className={'main-containter'}>
                <div className={'container-component'}>
                    <Editor />
                </div>
                <div className={'container-component'}>
                    <Diagram />
                </div>
            </div>
        </>
    )
}
