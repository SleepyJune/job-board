class JobDescriptionMarkup:

    def __init__(self, job):
        self.job = job

    def GetYOE(self):
        arr = self.job.split("<li>")
        print(arr)