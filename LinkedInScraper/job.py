from datetime import datetime

from jobDescriptionMarkup import JobDescriptionMarkup

class Job:
    def __init__(self, data):
        self.data = data
        self.jobId = int(data['dashEntityUrn'].split(':')[-1])
        self.jobTitle = data['title']        
        self.workRemote = data['workRemoteAllowed']
        self.jobState = data['jobState']
        self.location = data['formattedLocation']
        self.listedDate = datetime.fromtimestamp(int(data['listedAt']) // 1e3)
        
        markupHelper = JobDescriptionMarkup(self.data)
        self.description = markupHelper.GetMarkupText()

        self.companyName = data['companyDetails'].get("com.linkedin.voyager.deco.jobs.web.shared.WebCompactJobPostingCompany", {}).get("companyResolutionResult", {}).get("name","")

        if not self.companyName: #another way of getting company name
            self.companyName = data['companyDetails'].get("com.linkedin.voyager.jobs.JobPostingCompanyName", {}).get("companyName","")

        self.applyUrl = data['applyMethod'].get("com.linkedin.voyager.jobs.OffsiteApply", {}).get("companyApplyUrl","")

        self.yoe = None

    def GetJson(self):
        return {
            'linkedin_id': self.jobId,
            'job_title': self.jobTitle,
            'location': self.location,
            'company_name': self.companyName,
            'work_remote': self.workRemote,
            'apply_url': self.applyUrl,
            'listed_date': self.listedDate.isoformat(),
        }
    
    def GetJobDescriptionJson(self):
        return {
            'linkedin_id': self.jobId,
            'description': self.description,
        }