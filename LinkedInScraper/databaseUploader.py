import json
from os import walk
from datetime import datetime

import requests

from job import Job

class DatabaseUploader:
    
    def __init__(self):
        self.name = ""

    def GetStoredJobs(self):
        path = "Jobs/"
        storedJobs = {}

        for (dirpath, dirnames, filenames) in walk(path):
            #filenames.split(".")

            for filename in filenames:
                file = filename.split(".")
                if file[1] == "json":
                    with open(path + filename, 'r') as jsonfile:
                        data = json.load(jsonfile)
                        job = Job(data)
                        storedJobs[job.jobId] = job
                        #print(job.jobId)

        return storedJobs

    def GetUploadedJobIds(self):
        with open("uploadedJobs.json", 'r') as jsonfile:
            data = json.load(jsonfile)

        return set(data)

    def WriteUploadedJobIds(self,jobIds):
        arr = list(jobIds)

        with open("uploadedJobs.json", 'w') as jsonfile:
            json.dump(arr, jsonfile)

    def UploadJobs(self, config):
        jobs :list[Job] = list(self.GetStoredJobs().values())

        url = config['server_url'] + 'job'
        jobDescUrl = config['server_url'] + 'job_description'

        jobs.sort(key=lambda x: x.listedDate)

        uploadedJobIds = self.GetUploadedJobIds()

        for job in jobs:
            if config["skipUploadedJobs"] and job.jobId in uploadedJobIds:
                continue

            if config["uploadJobs"]:
                res = requests.post(url, json = job.GetJson(), verify=False)

                if not res.ok:
                    continue

                uploadedJobIds.add(job.jobId)

            if config["uploadJobDescriptions"]:
                res = requests.post(jobDescUrl, json = job.GetJobDescriptionJson(), verify=False)

                if not res.ok:
                    continue          

        self.WriteUploadedJobIds(uploadedJobIds)
    
#upload = DatabaseUploader()
#upload.UploadJobs()