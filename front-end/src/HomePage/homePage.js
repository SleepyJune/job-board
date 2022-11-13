import React, { useState } from 'react'

import './homePage.css'

import Carousel from 'react-bootstrap/Carousel';

const HomePage = () => {
    return (
        <>
            <div class="container">

                <br/>

                <h2>Features:</h2>

                <br/>

                <Carousel variant="dark" className="home-carousel" interval="60000">
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/HomePage/images/viewjobs.gif"
                        />
                        <Carousel.Caption>
                            <p className="carousel-caption-text">View jobs and job descriptions sorted by the newest.</p>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/HomePage/images/search.gif"
                        />
                        <Carousel.Caption>
                            <p>Search jobs by company and title.</p>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/HomePage/images/login.gif"
                        />
                        <Carousel.Caption>
                            <p>Login as test user.</p>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/HomePage/images/applied.gif"
                        />
                        <Carousel.Caption>
                            <p>Automatically mark job as applied.</p>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="/HomePage/images/filter.gif"
                        />
                        <Carousel.Caption>
                            <p>Filter jobs by company name.</p>
                        </Carousel.Caption>
                    </Carousel.Item>

                </Carousel>

                <br/>
                <br/>
                <br/>

                <h2>Description:</h2>
                <ul>
                    <li>Developed a website that shows the most relevant job postings for the user, that helps users focus on
                        quality applications and saves hours of time filtering job postings.</li>
                    <li>Built backend RESTful APIs using ASP.Net Core 6, Entity Framework, and Postgresql</li>
                    <li>Setup frontend website using React, Javascript, Bootstrap, HTML, and CSS.</li>
                    <li>Designed a python script to periodically scrape off job listings from Linkedin using Voyager’s API.</li>
                    <li>Setup web services for hosting the .Net Application on Amazon Lightsails linux server, the database on
                        AWS RDS Postgresql, static webpage on AWS S3, and routing on AWS Route 53.</li>
                </ul>

                <br/>

            </div>
        </>
    );
}

export default HomePage;