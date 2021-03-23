import bisect
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
nltk.download('vader_lexicon')

classifications = [
    'Very Negative',
    'Negative', 
    'Somewhat Negative', 
    'Neutral', 
    'Somewhat Positive', 
    'Positive', 
    'Very Positive'
]

def sentiment_classifier(classifications):
  '''
  Categorizes an input text based on its sentiment.
  
  Parameters:
  classifications (list): List of categories for classification of sentiments.

  Returns:
  sentiment (tuple): Contains sentiment classification and numeric sentiment (between -1 and 1).
  '''
  try:
    file_name = input('Welcome! Please type the path to your journal entry. \n' +
    'Ensure that the file is either a txt, doc, or docx file: ')
    
    with open(str(file_name), 'r', encoding='utf-8') as f:
      data = f.read()
    sia = SentimentIntensityAnalyzer().polarity_scores(data)

    thresholds = [-1, -.75, -0.5, -0.25, 0.25, 0.5, 0.75]
    classifications = classifications

    pos = bisect.bisect_left(thresholds, sia['compound'])
    value = classifications[pos-1] # Bisection search to grab appropriate classifaction from threshold
    
    print(f'\nPer our analysis, your mood appears to be: {value}.')

    return value, sia['compound']

  except (IOError, FileNotFoundError):
    return 'File could not be read; please ensure that your path and file type are correct.'
    
sentiment_classifier(classifications)
