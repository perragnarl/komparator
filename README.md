# komparator

## What is it?
A simple tool that visits two urls and takes a screenshot of each. It then compares the two screenshots and outputs the difference.

## Why?
The main reason for this tool is comparing two versions of a website during the migration from one version of a CMS to another.

## Prerequisites
* [Node.js](https://nodejs.org/en/)
* [npm](https://www.npmjs.com/)

## How to use it?
### Make a list of urls
Create a JSON file with a list of urls. The file should look like this:
```json
[
    {
        "name": "test1",
        "base": "https://www.example.com",
        "compare": "http://www.example.com",
        "wait": 10 // optional
    },
    {
        "name": "test2",
        "base": "https://www.anotherexample.com",
        "compare": "http://www.anotherexample.com",
        "wait": 5 // optional
    }
]
```

### Run the tool
Simply run the following command in a prepared folder where it can create a folder called `screenshots`:
```
npx komparator
```
