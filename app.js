//import express module and add type:module into the package.json
import express from "express";
import https from "https";
import bodyParser from "body-parser";
import path from "path";
const __dirname = path.resolve();

//initialize a new express app
const app = express();

//tell app the use the bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

/*
1. make a get request to the OpenWeatherMap's server - using the https node module
2. fetch the data back as a JSON and parse it to get the relevant info
 */

//create a route for the home page which sends back index.html file
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/");
});

/*
 1. create a post request to show the data
 2. break down the URL path 
        - query, which will be the city
        - app id saved into a variable
        - units saved into a variable

3. How to dynamically update the query? 
    - render the index.html when the user calls app.get at the root route
    - by wrapping the input inside a from -> can create a post request when the user hits the button
    - the form is going to make a post request to the specified route on my server -> can catch that request using app.post
    - in order the get the text that the user is written in the input -> install body-parser package
    - body parser allows us to look through the body of the post request and fetch the data based o the input's name(cityName)
*/
app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = "b6242586050ff60b57e3d629a95521f8";
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  //make a get request to the OpenWeatherMap's server - using the https node module
  https.get(url, function (response) {
    //console.log(response.statusCode);

    //fetch the data back as a JSON and parse it to get the relevant info
    response.on("data", function (data) {
      //convert data into a JS object
      const weatherData = JSON.parse(data);

      //dig through JS object to get some specific pieces data
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      //get the icon path
      const icon = weatherData.weather[0].icon;
      // create the image URL
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      //console.log(temp, weatherDescription, icon);

      //use res.write to send more information
      res.write(`<p>The weather is currently ${weatherDescription}</p>`);
      res.write(
        `<h1>The temperature in ${query} is ${temp} degrees Celcius.</h1>`
      );
      res.write("<img src=" + imageURL + ">");
      //pass the data back to the browser
      res.send();
    });
  });
});

//set the port
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
