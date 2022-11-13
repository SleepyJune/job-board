import React, { useEffect, useState, useRef, useContext } from 'react'

import './css/App.css';

import { apiUrl } from './App';
import { JobContext } from './context/JobContext';
import { SearchContext } from './context/SearchContext';
import { UserContext } from './context/UserContext';

import { getJobs } from './JobFetcher';

import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { RouteContext } from './context/RouteContext';

import ReactGA from 'react-ga';

const SearchBox = () => {
    const searchContext = useContext(SearchContext);
    const jobContext = useContext(JobContext);
    const userContext = useContext(UserContext);
    const setRoute = useContext(RouteContext).setRoute;

    const [show, setShow] = useState(false);

    const blankState = {
        job_title: "",
        company_name: "",
        applied_only: false,
    };

    const [searchState, setSearchState] = useState(blankState);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const showUserContent = userContext.user.isLoggedIn;

    const handleSubmit = event => {
        event.preventDefault();
        
        searchContext.setSearchPref({
            ...searchContext.searchPref,
            ...searchState,
            page: 1,
        })

        let params = {
            page: 1,
            job_title: searchState.job_title,
            company_name: searchState.company_name,
            applied_only: searchState.applied_only,
            jobContext: jobContext,
            incPage: searchContext.incPage,
            isNewSearch: true,
        }

        if(userContext.user.isLoggedIn) params.user_id = userContext.user.id;

        getJobs(params);

        setRoute("Jobs");
        setSearchState(blankState);

        ReactGA.event({
            category: "Website",
            action: "Search",
            label: "Search",
          })

        document.getElementById("searchForm").reset();
    }

    return (
        <>
            <Nav.Link href="#" onClick={handleShow}>Search</Nav.Link>

            <Modal show={show} onHide={handleClose}>
                <Form id="searchForm" onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Search</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Company</Form.Label>
                            <Form.Control type="text" placeholder="Company" onInput={e => setSearchState({...searchState, company_name: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Job Title</Form.Label>
                            <Form.Control type="text" placeholder="Software Developer" onInput={e => setSearchState({...searchState, job_title: e.target.value})} />
                        </Form.Group>

                        <Form.Group className={showUserContent?'mb-3':'hidden'} controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Applied Only" onChange={e => setSearchState({...searchState, applied_only: e.target.checked})} />
                        </Form.Group>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleClose} type="submit">
                            Submit
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default SearchBox;