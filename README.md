# UCF Coding Bootcamp Project 1
# https://skungiesingh.github.io/class-project-01/
<img width="1440" alt="Surf Florida" src="https://user-images.githubusercontent.com/78673754/113986558-0a28fd80-9856-11eb-9a2e-ec2691c41832.png">


## Members:

Emily Cremeans

Shastri Kungiesingh

Maneef Shaikh

Steven Black
 

## Requirements:

Utilize two server-side APIs

Store to local storage

Be dynamically loaded based on user input

Collaborate over GitHub

## Story:

This was the first collab project for the UCF Full-Stack Coding Bootcamp. We decided to have a buisness forward site that allows a user to load a desired city from a set list (the idea being those are the cities in which we have a buisness relationship with), upon picking a city the site then interacts with two seperate api's to gather the weather and tide information so that the user can then book an appointment with a surf instructor or (to our benefit) just increase the SEO traffic to the site by checking the current tides and weather at the same point. 

## Issues:

Being our first collaboration with teammates, we struggeled with GitHub branches pulling and pushing. By the end of the project we were became more fluent in how to interact with github asynchronously. The main problem we faced were being ahead of the develop branch in our individual branches then trying to merge 'upstream'. 

### Steven

Some issues I faced in the development of the backend of this site was returning an object that held my desired data from a fetch of a second API without loading errors. Through research I determined that I needed a 'wait' function and to turn my primary function to an 'asynch' function in order to get it to operate properly. Another thing that vexed me personally was trying to parse a very specific set of data out of a very long string without using a lot of individual steps for a more elegant solution. Ultimately, i resorted to creating a nested function that contained the multiple steps used to parse the data then passed the string to and from it. Not quite what i was hoping for in terms of elegance, but my inexperience did not lend itself to a better solution.

### Maneef

### Shastri

### Emily

## Future Development:
Eventually we'd like do a real life collaboration with local instructors, build logic to display color-coded peak times for activity, build in a payment and booking screen, style it to be mobile friendly, and expand the service to cover a wide range of florida-centric outdoor activities. 




