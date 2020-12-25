import PyPDF2
import datetime
import calendar


FILENAME='../resources/pdfs/a1.pdf'

days = [d for d in calendar.day_name]
day_abbr = [d for d in calendar.day_abbr]

month = [m for m in calendar.month_name]
month_abbr = [m for m in calendar.month_abbr]

with open(FILENAME, 'rb') as pdfFileObj:
  pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
  pageObj = pdfReader.getPage(0)
  text = pageObj.extractText()



  print(text)

calendar.da