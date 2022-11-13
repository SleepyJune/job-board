import React, { useEffect, useState, useRef, useContext } from 'react'
import './css/job.css';

import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

import htmlParser from 'html-react-parser';

import { UserContext } from './context/UserContext'

import { apiUrl } from './App';
import { SelectJobContext } from './context/SelectedJobContext';
import { JobContext } from './context/JobContext';

import { filterJobs } from './Filter';
import { SearchContext } from './context/SearchContext';

import ReactGA from 'react-ga';
import { Container } from 'react-bootstrap';

const JobList = () => {
    const jobContext = useContext(JobContext);
    const jobs = jobContext.jobs;

    const searchContext = useContext(SearchContext);

    const filteredJobs = filterJobs(searchContext.searchPref, jobs);

    let display = filteredJobs.map((job) =>
        <Job key={job.id} jobData={job} ></Job>
    );

    if (jobs.length <= 0) {
        display =

            <div className="div-no-results">
                <div className="text-no-results">
                    <br />
                    <h1>No results</h1>
                </div>
            </div>
    }

    return (
        <div>{display}</div>
    );
};

const Job = (context) => {
    const job = context.jobData;

    const selectedJobContext = useContext(SelectJobContext);
    const selectedJob = selectedJobContext.selectedJob;

    const remoteBadge = job.work_remote ? <Badge bg="success">Remote</Badge> : "";

    let applyButton = null;

    const openUrl = (url) => { window.open(url, '_blank') };
    const linkedInUrl = 'https://www.linkedin.com/jobs/collections/recommended/?currentJobId=' + job.linkedin_id;
    const linkedInButton = <Dropdown.Item href="#" onClick={() => openUrl(linkedInUrl)}>LinkedIn</Dropdown.Item>

    const glassdoorUrl = 'https://www.glassdoor.ca/Salaries/company-salaries.htm?typedKeyword=' + job.company_name +
        '&typedLocation=Canada&sc.keyword=' + job.company_name;

    const glassdoorButton = <Dropdown.Item href="#" onClick={() => openUrl(glassdoorUrl)}>Glassdoor</Dropdown.Item>

    const onJobClickedFn = () => onJobClicked(job, selectedJobContext.setSelectedJob);

    let selectedJobStyle = {};
    if (selectedJob && selectedJob.job && selectedJob.job.id === job.id) {
        selectedJobStyle = { backgroundColor: '#e8f7fa' };
    }

    return (
        <div className="job-frame" style={selectedJobStyle}>
            <button className="button-link" job={job} onClick={onJobClickedFn}><h5 >{remoteBadge} {job.job_title}</h5></button>

            <div>{job.company_name}</div>
            <div>{job.location}</div>
            <JobDate jobData={job} />

            <ApplyButton job={job} />

            <Dropdown className='job-actions-dropdown'>
                <Dropdown.Toggle variant="success" id="dropdown-basic">Links</Dropdown.Toggle>

                <Dropdown.Menu>
                    {linkedInButton}
                    {glassdoorButton}
                </Dropdown.Menu>
            </Dropdown>

            <div className="float-wall"></div>
        </div>
    );
}

const useGetAppliedDate = (job_id) => {
    const userContext = useContext(UserContext);
    const appliedJobs = userContext.appliedJobs;

    if (appliedJobs) {
        let apply_date = appliedJobs[job_id];

        if (apply_date) {
            return (apply_date);
        }
    }

    return (null);
}

const ApplyButton = (props) => {
    const userContext = useContext(UserContext);
    const user = userContext.user;
    const job = props.job;

    const openUrl = (url) => { window.open(url, '_blank') };

    let linkedInUrl = 'https://www.linkedin.com/jobs/collections/recommended/?currentJobId=' + job.linkedin_id;
    let applyUrl = job.apply_url;

    if (!applyUrl) applyUrl = linkedInUrl;

    const applyTime = useGetAppliedDate(job.id);

    const onButtonClicked = () => {
        if (applyTime == null) {
            openUrl(applyUrl);
        }

        if (user.isLoggedIn) {
            markAsApplied(userContext, job.id)
        }
    }

    let applyButton = <Button className='apply-button' onClick={onButtonClicked}>Apply</Button>;
    if (applyTime) {
        applyButton = <Button className='apply-button' onClick={onButtonClicked}>Applied ✔</Button>;
    }



    return (
        <>
            {applyButton}
        </>
    )
}

const markAsApplied = (userContext, job_id) => {
    const user_id = userContext.user.id;

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user_id, job_id: job_id })
    };

    fetch(apiUrl + 'appliedjob', requestOptions)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return null;
            }
        })
        .then(data => {
            if (data) {
                const copy = { ...userContext.appliedJobs };
                copy[job_id] = data.apply_date;
                userContext.setAppliedJobs(copy);
            } else {
                const copy = { ...userContext.appliedJobs };
                delete copy[job_id];
                userContext.setAppliedJobs(copy);
            }
        });
}

const onJobClicked = (job, setSelectedJob) => {
    if (job.id == null) return;

    eventTrack("Website", "Click", "Job clicked");

    fetch(apiUrl + 'job_description?id=' + job.id)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw response;
        }).then(resData => {
            let desc = resData.description;

            setSelectedJob({ job: job, description: desc, loading: false });
            console.log('fetch job description');
        })
}

export const JobDescription = (props) => {
    const myContainer = useRef(null);

    const selectedJobContext = useContext(SelectJobContext);
    const selectedJob = selectedJobContext.selectedJob;

    const jobs = props.jobs;
    const job = selectedJob.job;

    if (selectedJob.loading && jobs && jobs.length > 0) {
        onJobClicked(jobs[0], selectedJobContext.setSelectedJob);
    }

    let description = "loading";
    if (selectedJob.description) {
        description = htmlParser(selectedJob.description);
    }

    useEffect(() => {
        myContainer.current.scrollTop = 0;
    })

    return (
        <div className="description-frame">
            <div ref={myContainer} className='description-inside'>
                <br/>
                <h5 className='description-title'>Description</h5>
                <div>{description}</div>
                <br/>
            </div>
        </div>
    )
}

const JobDate = (context) => {
    let job = context.jobData;
    const listedDate = Date.parse(job.listed_date);

    const hourDiff = Math.floor((Date.now() - listedDate) / (1000 * 3600));

    let dateDisplay = "";

    if (hourDiff < 24) {
        dateDisplay = hourDiff + " hours ago";
    } else {
        let dayDiff = Math.floor(hourDiff / 24);
        dateDisplay = dayDiff + " days ago";
    }

    return (
        <div>{dateDisplay}</div>
    );
}

const eventTrack = (category, action, label) => {
    //console.log("GA event:", category, ":", action, ":", label);
    ReactGA.event({
        category: category,
        action: action,
        label: label,
    })
}

export default JobList;