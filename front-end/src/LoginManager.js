import React, { useState, useContext } from 'react';

import "./css/App.css"

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { UserContext } from './context/UserContext'
import { SearchContext } from './context/SearchContext';
import { RouteContext } from './context/RouteContext';
import { JobContext } from './context/JobContext';

import { getJobs } from './JobFetcher';

import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { apiUrl } from './App';

import FilterBox from './Filter';

import ReactGA from 'react-ga';

const LoginManager = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const setRoute = useContext(RouteContext).setRoute;
  const jobContext = useContext(JobContext);

  const userContext = useContext(UserContext);
  let user = userContext.user;

  const searchContext = useContext(SearchContext);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();

    login(email, password);
  }

  const login = (email, password) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    };

    fetch(apiUrl + 'login', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        data['isLoggedIn'] = true;
        userContext.setUser(data);
        searchContext.setSearchPref({ ...searchContext.searchPref, user_id: data.id })

        fetchAppliedJobs(data.id, userContext.setAppliedJobs);
        fetchCompanyFilters(data.id, searchContext);
      });
  }

  const handleTestUserLogin = event => {
    const email = "test@gmail.com";
    const password = "123";

    login(email, password);

    ReactGA.event({
      category: "Website",
      action: "Login",
      label: "Login As TestUser",
    })

    handleClose();
  }

  const handleLogout = e => {
    window.location.reload();
  }

  if (user.isLoggedIn) {

    const OnAppliedClick = e => {
      
      searchContext.resetSearchPref({ applied_only: true });

      let params = {
        page: 1,
        job_title: null,
        company_name: null,
        applied_only: true,
        jobContext: jobContext,
        incPage: searchContext.incPage,
        user_id: user.id,
        isNewSearch: true,
      }

      getJobs(params);
      setRoute("Jobs");
    }

    return (
      <>
        <NavDropdown title={user.name} id="navbarScrollingDropdown" align="end">

          <NavDropdown.Item href="#" onClick={OnAppliedClick}>Applied</NavDropdown.Item>
          <FilterBox />

          <NavDropdown.Divider />

          <NavDropdown.Item onClick={handleLogout}>
            Logout
          </NavDropdown.Item>
        </NavDropdown>
      </>
    );
  }

  return (
    <>
      <Nav.Link href="#" onClick={handleShow}>Login</Nav.Link>

      <Modal show={show} onHide={handleClose}>
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Please sign in</Modal.Title>
          </Modal.Header>

          <Modal.Body>

            <div className="form-floating">
              <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" onChange={e => setEmail(e.target.value)} />
              <label for="floatingInput">Email address</label>
            </div>

            <div className="form-floating">
              <input type="password" className="form-control" id="floatingPassword" placeholder="Password" onChange={e => setPassword(e.target.value)} />
              <label for="floatingPassword">Password</label>
            </div>

            <div style={{ padding: 15 }}></div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="warning" onClick={handleTestUserLogin} className="me-auto">
              Login As Test User
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose} type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

const fetchAppliedJobs = (user_id, setAppliedJobs) => {
  fetch(apiUrl + 'appliedjob?user_id=' + user_id)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then(data => {
      var dict = {}

      for (let i = 0; i < data.length; i++) {
        let appliedJob = data[i];

        dict[appliedJob.job_id] = appliedJob.apply_date;
      }

      setAppliedJobs(dict);
    });
}

const fetchCompanyFilters = (user_id, searchContext) => {

  fetch(apiUrl + 'usercompanyfilter?user_id=' + user_id)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then(data => {
      var set = new Set();

      for (let i = 0; i < data.length; i++) {
        let item = data[i];

        set.add(item.company_name);
      }

      searchContext.setSearchPref({ ...searchContext.searchPref, filter_companies: set });
    });
}

export default LoginManager;