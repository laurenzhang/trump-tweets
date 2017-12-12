#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
parse_insults.py: retrieve links to all of Donald Trump's insulting tweets
compiled in the following NY Times article:
https://www.nytimes.com/interactive/2016/01/28/upshot/donald-trump-twitter-insults.html
"""

import json

from requests import get
from bs4 import BeautifulSoup


URL = 'https://www.nytimes.com/interactive/2016/01/28/upshot/donald-trump-twitter-insults.html'
request = get(URL)
request.raise_for_status()

soup = BeautifulSoup(request.text, 'html.parser')
insult_tweets = {}

# Each 'g-entity-item' div container contains:
#   - insulted person or thing, named in 'g-entity-name' div container
#   - list of links to tweets about that person or thing
entities = soup.find_all('div', {'class': 'g-entity-item'})

for entity in entities:
    key = entity.find('div', {'class': 'g-entity-name'}).text
    values = [a.attrs['href'][len('https://twitter.com/realDonaldTrump/status/'):] for a in entity.find_all('a')]

    # Remove any duplicate links
    values = list(set(values))
    
    insult_tweets[key] = values

# print(json.dumps(insult_tweets))

with open('json/insult_tweets.json', 'w') as file:
    file.write(json.dumps(insult_tweets))
