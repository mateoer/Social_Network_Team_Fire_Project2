# RevatureProject2TeamFire

## Project Description

Our goal is to build a social networking platform, where you can share your opinions on different forms of media. We did this by having our posts centered around a review item and then attributing a review score to it. All people, including friends, can comment on the post to share their thoughts on the post as well.

## Technologies Used

* Spring Boot, Web, Beans, Context, WebMVC, Test - version 2.6.3
* ProjectLombok - version 2.6.3
* PostgreSQL - version 2.6.3
* JacksonDatabind - version 2.6.3
* AWS - S3, EC2, and RDS

## Features

List of features ready
* Post to your profile a review of a piece of media
* View, Comment, and Like other's reviews
* Sort through the posts by different values

To-do list:
* Add YouTube's API to have trailer's of the specified media show on the website.
* Add user rankings based on many likes their reviews get.

## Getting Started

> git clone https://github.com/Calihar/RevatureProject2TeamFire.git  
> Ensure that the ENV variables are set up to match the ones asked for by the application.yml
> This project uses AWS's S3, EC2, and RDS, so ensure that the endpoints are set up for your personal DB and S3 bucket.

## Usage

> To use this project, you can deploy it on a personal machine with a forwarded port or can use EC2 to deploy on an Amazon machine.
> If you decide to use it, then I am glad it could be of service to you.
>To properly use this project, you will need to set up system ENV variables that your IDE will read on start-up. They need to be mapped to the user name and password connected to the data base. You will also need to have an endpoint:port that directs you to the database. 

## Contributors

> Caleb Gulledge
> David Dominguez
> Eric Mateo
> Stephen Brady

## License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
