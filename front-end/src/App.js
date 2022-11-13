import React, { useEffect, useState, useContext } from 'react';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import InfiniteScroll from "react-infinite-scroll-component";

import JobList, { JobDescription } from './job'

import JobContextProvider, { JobContext } from './context/JobContext';
import UserContextProvider, { UserContext } from './context/UserContext';
import SelectJobContextProvider from './context/SelectedJobContext';
import SearchContextProvider, { SearchContext } from './context/SearchContext';
import RouteContextProvider, { RouteContext } from './context/RouteContext';

import HomePage from './HomePage/homePage';

import { getNextJobs } from './JobFetcher';

import NavBar from './NavBar';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './css/App.css'

import configData from "./config.json"

import ReactGA from 'react-ga';
const TRACKING_ID = "UA-246527080-1"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

export const apiUrl = configData.server_url;
//export const apiUrl = configData.test_url;

const App = () => {

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  return (
    <>
      <RouteContextProvider>
        <JobContextProvider>
          <SearchContextProvider>
            <SelectJobContextProvider>
              <UserContextProvider>

                <AppBody />

              </UserContextProvider>
            </SelectJobContextProvider>
          </SearchContextProvider>
        </JobContextProvider>
      </RouteContextProvider>
    </>
  );
}

const AppBody = () => {

  const route = useContext(RouteContext).route;
  let body = <div />;

  if (route == "Home") body = <HomePage />;
  if (route == "Jobs") body = <JobListBody />;


  return (
    <>
      <NavBar />

      <div className='app-body'>
        <Container fluid>
          <Row>
            {body}
          </Row>
        </Container>
      </div>
    </>
  )
}

const JobListBody = () => {
  const jobContext = useContext(JobContext);
  const userContext = useContext(UserContext);
  const jobs = jobContext.jobs;

  const searchContext = useContext(SearchContext);

  const fetchJobs = () => getNextJobs(userContext, jobContext, searchContext);

  useEffect(() => {
    getNextJobs(userContext, jobContext, searchContext, true);
  }, [])

  return (

    <div className='joblist-background'>
      <Container fluid>
        <Row >
          <Col>
            <div className="joblist">
              <InfiniteScroll
                dataLength={jobs.length} //This is important field to render the next data
                next={fetchJobs}
                hasMore={true}
                loader={<></>}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
              >
                <JobList />
              </InfiniteScroll>
            </div>
          </Col>
          <Col xs={7}><JobDescription jobs={jobs} /></Col>
        </Row>
      </Container>
    </div>
  )
}

export default App;