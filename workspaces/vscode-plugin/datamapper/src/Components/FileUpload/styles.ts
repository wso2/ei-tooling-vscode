import { createStyles, makeStyles } from "@mui/styles";


export const uploadStyles = makeStyles(() => createStyles({
    header : {
        alignItems : 'flex-end',
        backgroundColor:'white',
        margin:'0px !important',
        justifyContent:'flex-end !important'
    },
    dialogHeader: {
        height: '40px',
        color: 'white',
        backgroundColor: '#187bcd',
        fontFamily: 'Asap !important',
        fontWeight: '700',
        fontSize: '14px !important',
        padding: '0px 0px 10px 20px !important',
        marginBottom: '10px !important'
    },
    closeButton : {
        paddingLeft: '62% !important'
    },
    saveButton : {
        marginLeft: '70% !important', 
        fontSize: '10px !important', 
        width: '60px !important', 
        height: '30px !important'
    },
    Label : {
        fontSize :'11px !important'
    },
    Select : {
        margin: '8px 0px 10px 0px !important', 
        alignItems: 'center', 
        height: '35px !important', 
        fontSize: '11px !important', 
        minWidth: '130px !important' 
    },
    FileInput : {
        marginTop: '8px !important', 
    },
    TextField : {
        paddingBottom:'10px !important',
        paddingRight :'10px !important',
    }
})
);