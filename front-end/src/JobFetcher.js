import React, { useEffect, useState, useRef, useContext } from 'react'

import { apiUrl } from './App';
import { JobContext } from './context/JobContext';
import { SearchContext } from './context/SearchContext';

export const getJobs = (params) => {

    //console.log(params);

    const page = params.page;

    const jobTitleComponent = encodeURIComponent(params.job_title ?? "");
    const companyNameComponent = encodeURIComponent(params.company_name ?? "");
    const userIdComponent = encodeURIComponent(params.applied_only ? (params.user_id ?? "") : "");

    fetch(apiUrl + 'job?page=' + page +
        "&job_title=" + jobTitleComponent +
        "&company_name=" + companyNameComponent +
        "&applied_user_id=" + userIdComponent)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw response;
        }).then(resData => {

            if (params.isNewSearch === true) {
                params.jobContext.setJobs(resData);
            } else {
                params.jobContext.setJobs(params.jobContext.jobs.concat(resData));
                params.incPage();
            }

            console.log('fetch jobs');
        }).catch(error => {
            console.error("Error fetching data: ", error)
        })
}

export const getNextJobs = (UserContext, JobContext, SearchContext, isFirstSearch) => {

    let page = SearchContext.searchPref.page;
    let job_title = SearchContext.searchPref.job_title;
    let company_name = SearchContext.searchPref.company_name;
    let applied_only = SearchContext.searchPref.applied_only;

    let user_id = 0;
    if (UserContext.user.isLoggedIn) user_id = UserContext.user.id;

    let params = {
        page: page + (isFirstSearch ? 0 : 1),
        job_title: job_title,
        company_name: company_name,
        applied_only: applied_only,
        user_id: user_id,
        jobContext: JobContext,
        setNextPage: null,
        incPage: SearchContext.incPage,
        isNewSearch: (isFirstSearch ? true : false),
    }

    getJobs(params);
}