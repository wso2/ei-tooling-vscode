import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { sanitizeBadJson } from "./util";

export function Editor() {
    const { dispatch } = useAppContext();
    const [textAreaVal, setTextAreaVal] = useState("");

    const onChange = (evt: any) => {
        setTextAreaVal(evt.target.value);
    }

    const onSubmit = () => {
        const sanitizedJson = sanitizeBadJson(textAreaVal)
        dispatch({ type: 'DIAGRAM_CLEAN_DRAW', payload: { model: JSON.parse(sanitizedJson) } })
    }

    return (
        <>
            <textarea onChange={onChange} value={textAreaVal} />
            <button onClick={onSubmit} type="button">Submit</button>
        </>
    )
}
