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

import { createStyles, makeStyles } from "@mui/styles";

export const DiagramStyles = makeStyles(() => createStyles({
	canvas: {
		height: '1000px',
		width: '100%',
		textAlign: 'center',
	},
	clrButton: {
		backgroundColor: '#c0c0c0 !important',
		fontFamily: 'monospace !important',
		height: '25px !important',
		fontSize: '11px !important',
		'&:hover': {
			backgroundColor: '#d3d3d3d3 !important',
		},
	},
	buttonWrap: {
		bottom: '10px',
		position:'absolute',
		right: '230px'
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
		color: '#8d91a3',
		fontSize: '15px !important'
	}
})
);
