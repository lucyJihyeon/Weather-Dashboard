# Weather-Dashboard

## Description 
This is a weather dashboard designed to provide users wirh real-time weather information based on the city from the user input. This app uses Open Weather Maps Api to get the current weather information and 5-day forecast datas of the specific city. 

## Table of Contents 
- [Features](#features)
- [Technologies-Used](#technologies)
- [Usage](#usage)
- [Preview](#preview)
- [Link](#link)

## Features 

## Dynamic Weather Display 

### User Story 
    As a traveler 
    I WANT TO see detailed weather information of a desired city 
    SO THAT I can plan my trip according to the temperature, humidity, and wind speed

### Accepted Criteria
    - Given I enter a certain city,
    - When I hit the search button
    - Then I am directed to the result page
    - When I see the result container
    - Then I am presented with the city name, matching weather icon, and the current weather information(temperature, wind speed, humidity) of the city 

## Five-Day Forecast 

### User Story 
    As a traveler 
    I WANT TO see the weather information of the next 5 days 
    SO THAT I can plan for the next 5 days ahead of time

### Accepted Criteria 
    - Given I enter a certain city,
    - When I hit the search button 
    - Then I am presented with the 5-day forecast section that provides a forecast for the next five days. 
    - When I view the 5-day forecast section
    - Then I am presented with the detailed information including 
    date, weather icon, temperature, wind speed, and the humidity

## History 

### User Story 
    As a user
    I WANT TO be able to see all the weather information of the cities I searched before 
    SO THAT I can easily find what cities I searched for and retrieve the datas back 
### Accepted Criteria
    - Given I search for a city 
    - When I hit the search button 
    - Then I am presented with the button with the searched city name on it 
    - When I click the button 
    - Then I am presented with the current weather information in the result container and the 5-day forecast 

## Technologies 
- HTML 
- CSS
- JavaScript 
    - Bootstraps : used to add styles 
    - FontAwesome : used to add a weather icon 
    - Dayjs : used to get the current date and the next 5 days' dates
    - Jquery : used to interact with HTML elements and manage events
 
## Usage 

1. Enter a city to search the current weather information and the next five day forecast 
2. Explore the result container to see the current weather description, temperature, wind speed, and the humidity 
3. Explore the forecast for the next five days 
4. Click on the history city button to retrieve the current 
weather information and the next five days forecast of the city searched before. 

## preview 
This is the preview of the application 
![alt weather dashboard preview](./assets/img/weather-dashboard.gif)

## Link 
This is the link of the deployed webpage 
[Weather-Dashboard](https://lucyjihyeon.github.io/Weather-Dashboard/)
