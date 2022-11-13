import json
from os import walk
from linkedin_api import Linkedin

from random import randint
from time import sleep

from datetime import datetime

from databaseUploader import DatabaseUploader

with open("linkedin.json", "r") as jsonfile:
    cred = json.load(jsonfile)

with open("config.json", "r") as jsonfile:
    config = json.load(jsonfile)

# Authenticate using any Linkedin account credentials
api = Linkedin(cred["email"], cred["password"])

#data = api.search_jobs("Software Developer")

#data = {"something":"something"}

def RefreshAllJobsDatabase():
    if config['lastRefreshTime']:
        lastRefresh = datetime.fromisoformat(config['lastRefreshTime'])
        timeSince = datetime.now() - lastRefresh
        
        if timeSince.total_seconds() <= 6 * 60 * 60:
            return #only 6 hours passed, don't need to start another one

    data = api.search_jobs(
        keywords="Software Developer", 
        location_name="Vancouver, British Columbia, Canada",
        listed_at= 24*60*60 * 2) #1 days

    with open("allJobs.json","w") as jsonfile:
        json.dump(data, jsonfile)

    config['lastRefreshTime'] = str(datetime.now())

    with open("config.json", "w") as jsonfile:
        json.dump(config, jsonfile)

    print("Finished refreshing all jobs database.")

def GetAllJobs():
    with open("allJobs.json","r") as jsonfile:
        data = json.load(jsonfile)
    
    jobIds = []

    #order by listed date
    data.sort(key=lambda x: x['listedAt'], reverse=True)

    for job in data:
        arr = job['entityUrn'].split(":")
        jobId = arr[-1]
        
        timestamp = int(job['listedAt']) // 1e3
        jobListedDate = datetime.fromtimestamp(timestamp)

        #print(jobListedDate, jobId)

        if FilterJobByHeader(job):
            continue

        jobIds.append(jobId)
    
    return jobIds

def FilterJobByHeader(jobHeader):
    title = jobHeader['title'].lower()

    excludeWords = ["senior", "lead", "principal", "manager", "staff", "sr."]

    for word in excludeWords:
        if word in title:
            return True

    return False

def GetStoredJobs():
    storedJobs = set()
    path = "Jobs/"

    for (dirpath, dirnames, filenames) in walk(path):
        #filenames.split(".")
        
        for file in filenames:
            file = file.split(".")
            if file[1] == "json":
                storedJobs.add(file[0]) #jobId
            
    return storedJobs

def StoreJobData(jobId):
    data = api.get_job(jobId)

    with open("Jobs/" + jobId + ".json","w") as jsonfile:
        json.dump(data, jsonfile)        

def StartScrapingJobs():
    storedJobs = GetStoredJobs() #set of jobIds

    RefreshAllJobsDatabase()

    jobIds = GetAllJobs() #ordered job ids
    jobIdSet = set(jobIds)

    unfinished = jobIdSet.difference(storedJobs)

    print(str(len(unfinished)) + " new jobs to scrape.")

    jobsToScrape = []

    for jobId in jobIds:
        if jobId in unfinished:
            jobsToScrape.append(jobId)

    for i in range(len(jobsToScrape)):
        jobId = jobsToScrape[i]

        sleep(randint(10,60)) #random sleep
        StoreJobData(jobId)

        startStr = "(" + str(i+1) + "/" + str(len(jobsToScrape)) + ") "

        print(startStr + "Saved job " + jobId + " to file.")

if config['scrapeJobs']:
    StartScrapingJobs()

upload = DatabaseUploader()
upload.UploadJobs(config)