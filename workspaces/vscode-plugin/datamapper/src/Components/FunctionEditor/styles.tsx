import { createStyles, makeStyles } from "@mui/styles";

export const FunctionStyles = makeStyles(() => createStyles({
    header : {
        backgroundColor:'#87CEEB !important',
        padding:'0px !Important'
    },
    ListItemText: {
        fontSize:'12px !important',
        fontFamily :'monospace !important',
        fontWeight:'bold',
    },
    listItem :{
        paddingTop : '0px !important',
        paddingBottom :'0px !important',
    },
    accordian : {
        backgroundColor : '#f5f5f5 !important',
    },
    text : {
        lineHeight:'30px',
    }
})
);