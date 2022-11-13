class Markup:
    def __init__(self, position, text):
        self.position = position
        self.length = len(text)
        self.text = text

class JobDescriptionMarkup:

    def __init__(self, job):
        self.job = job
        self.originalText = job['description']['text']
        self.text = self.originalText
        self.markupApplied :list[Markup] = []
        
    def GetMarkupText(self):
        attributes = self.job['description']['attributes']

        attributes.sort(key=lambda x: (x['start'], -x['length']))

        count = 0
        
        for attribute in attributes:
            self.ApplyAttribute(attribute)
            count += 1

        #self.text = self.text.replace('\n','')

        return self.text
        
    def GetTextPosition(self, position):
        displacement = 0

        for markup in self.markupApplied:
            if markup.position > position:
                continue
            
            displacement += markup.length

        return position + displacement

    def ApplyAttribute(self, attribute):
        startMarkup, endMarkup = self.GetAttributeHtml(attribute)

        startPosition = attribute["start"]
        endPosition = startPosition + attribute["length"]

        if startMarkup:
            self.ApplyMarkup(startPosition, startMarkup)
        
        if endMarkup:
            self.ApplyMarkup(endPosition, endMarkup)

    def ApplyMarkup(self, position, text):
        realPosition = self.GetTextPosition(position)
        newMarkup = Markup(position, text)
        
        #print(realPosition, text)

        if realPosition > 0:
            self.text = self.text[:realPosition] + text + self.text[realPosition:]
        else:
            self.text = text + self.text

        self.markupApplied.append(newMarkup)       


    def GetAttributeHtml(self, attribute):
        type = attribute['type']

        if type and len(type) > 0:
            type = next(iter(type))
        
        if type == "com.linkedin.pemberly.text.Bold":
            return "<b>","</b>"
        elif type == "com.linkedin.pemberly.text.LineBreak":
            return "<br>", None
        elif type == "com.linkedin.pemberly.text.Paragraph":
            return "<p>","</p>"
        elif type == "com.linkedin.pemberly.text.ListItem":
            return "<li>","</li>"
        elif type == "com.linkedin.pemberly.text.List":
            if attribute['type']["com.linkedin.pemberly.text.List"]["ordered"]:
                return "<ol>","</ol>"
            else:
                return "<ul>","</ul>"

        return None, None
