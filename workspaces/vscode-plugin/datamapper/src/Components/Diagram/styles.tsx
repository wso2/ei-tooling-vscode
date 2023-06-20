import { createStyles, makeStyles } from "@mui/styles";

export const DiagramStyles = makeStyles(() => createStyles({
	canvas: {
		height: '1000px',
		width: '100%',
		textAlign: 'center',
	},
	clrButtonWrap : {
		paddingLeft : '85%',
	},
	clrButton : {
		backgroundColor: '#c0c0c0 !important', 
		fontFamily: 'monospace !important',
		height:'25px !important',
		fontSize : '13px !important',
		'&:hover': {
			backgroundColor: '#d3d3d3d3 !important', 
		  },
	},
	buttonWrap: {
		position: 'absolute',
		bottom: '10px',
		right: '20px'
	},
	iconWrap: {
		marginBottom: '10px',
		background: '#d8d8d8',
		height: '35px',
		width: '35px',
		borderRadius: '20px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		boxShadow: '0 1px 1px 0 #cbcfda;',
		transitionDuration: '0.2s',
		'&:hover': { opacity: 0.5 },
	},
	icon:
	{
		color: '#8d91a3'
	}
})
);