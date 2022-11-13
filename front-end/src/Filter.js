import React, { useEffect, useState, useRef, useContext } from 'react'

import { apiUrl } from './App';
import { JobContext } from './context/JobContext';
import { SearchContext } from './context/SearchContext';

import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';

import { UserContext } from './context/UserContext'

import './css/filter.css';

const FilterBox = () => {
    const searchContext = useContext(SearchContext);
    const userContext = useContext(UserContext);

    const jobContext = useContext(JobContext);

    let companies = searchContext.searchPref.filter_companies;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let filterCompanyList = [...companies.keys()].map((company_name) =>
        <CompanyListItem key={company_name} company_name={company_name} userContext={userContext} searchContext={searchContext} />
    );

    const [addCompanyInput, setAddCompanyInput] = useState("");

    const onAddNewFilterCompanyClick = event => {
        event.preventDefault();

        AddFilterCompany(userContext, searchContext, addCompanyInput);

        document.getElementById("filterCompanyForm").reset();
    }

    return (
        <>
            <NavDropdown.Item href="#" onClick={handleShow}>Filters</NavDropdown.Item>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Filters</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form id="filterCompanyForm" onSubmit={onAddNewFilterCompanyClick}>
                        <div>
                            <h6>Filter by Company</h6>

                            <ListGroup className="filterCompanyList">
                                {filterCompanyList}
                            </ListGroup>

                            <InputGroup className="add-company-input">
                                <Form.Control type="text" placeholder="Company Name" onInput={e => setAddCompanyInput(e.target.value)} />
                                <Button variant="outline-secondary" type="submit">Add</Button>
                            </InputGroup>

                        </div>
                    </Form>

                </Modal.Body>
            </Modal>
        </>
    );
}

const CompanyListItem = (props) => {
    const searchContext = props.searchContext;
    const userContext = props.userContext;
    const company_name = props.company_name;

    return (
        <ListGroup.Item>
            {company_name}<span className="close" onClick={() => DeleteFilterCompany(userContext, searchContext, company_name)}>x</span>
        </ListGroup.Item>
    )
}

const AddFilterCompany = (userContext, searchContext, company_name) => {
    const companies = searchContext.searchPref.filter_companies;

    if (company_name == null || company_name == "") return;

    if(companies.has(company_name)) return;

    companies.add(company_name);
    searchContext.setSearchPref({ ...searchContext.searchPref, filter_companies: companies });

    UpdateServerFilterCompany(userContext, company_name, "POST");
}

const DeleteFilterCompany = (userContext, searchContext, company_name) => {
    const companies = searchContext.searchPref.filter_companies;

    if (company_name == null || company_name == "") return;

    companies.delete(company_name);
    searchContext.setSearchPref({ ...searchContext.searchPref, filter_companies: companies });

    UpdateServerFilterCompany(userContext, company_name, "DELETE");
}

const UpdateServerFilterCompany = (userContext, company_name, method) => {

    const user_id = userContext.user.id;
    if (user_id != null && user_id !== 0) {
        const requestOptions = {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user_id, company_name: company_name })
        };

        fetch(apiUrl + 'usercompanyfilter', requestOptions);

        console.log(method + " UserCompanyFilter: " + company_name);
    }
}

export const filterJobs = (searchPref, jobs) => {
    return filterJobsByCompany(searchPref, jobs);
}

const filterJobsByCompany = (searchPref, jobs) => {

    let companies = searchPref.filter_companies;

    let ret = [];

    for (var i = 0; i < jobs.length; i++) {
        let job = jobs[i];

        if (!companies.has(job.company_name)) {
            ret.push(job);
        }
    }

    return ret;
}

export default FilterBox;