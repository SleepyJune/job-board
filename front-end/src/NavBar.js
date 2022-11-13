import React, { useState, useContext } from 'react';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import LoginManager from './LoginManager';
import SearchBox from './Search';
import FilterBox from './Filter';

import Container from 'react-bootstrap/Container';
import { RouteContext } from './context/RouteContext';

const NavBar = () => {

    const route = useContext(RouteContext).route;
    const setRoute = useContext(RouteContext).setRoute;

    const onHomeBtnClicked = () => {
        setRoute("Home");
    }

    const onJobsBtnClicked = () => {
        setRoute("Jobs");
    }

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" fixed="top" >
                <Container fluid>
                    <Navbar.Brand href="#">ProjectDongi</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#" onClick={onHomeBtnClicked}>Home</Nav.Link>
                            <Nav.Link href="#" onClick={onJobsBtnClicked}>Jobs</Nav.Link>
                            <SearchBox />
                        </Nav>
                        <Nav className="ms-auto">
                            <LoginManager />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default NavBar;