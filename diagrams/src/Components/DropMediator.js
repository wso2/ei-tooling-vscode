import React from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default class DropMediator extends React.Component {
    render() {
        const popover = (
            <Popover id="popover-basic">
                <ButtonGroup vertical>
                <Button onClick={this.props.onCallClick}>Call</Button>

                    <Button onClick={this.props.onLogClick}>Log</Button>
                    <Button onClick={this.props.onPropertyClick}>Property</Button>
                </ButtonGroup>
            </Popover>
        );

        const Example = () => (
            <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                <Button className ="plusBut">+</Button>
            </OverlayTrigger>
        );

        return <div className='Webui'>
            <div className='popup'>
                <button className='mediators1'>Drop Mediator</button>
                <div className='plus'>
                    <Popup trigger={<Example></Example>} position="rightcenter" />
                </div>
            </div>
        </div>;
    }
}