A first attempt at doing a "orchestrable classroom" online application using the Meteor framework

# Features
Current prototype concentrates on having a **reactive visualization** of the classroom/device state:

http://localhost:3000/

...and exposing a **REST API** for such a state, in the form:

http://localhost:3000/api/classrooms - exposes the global classroom state objects (JSON), including devices (lamps) in the classroom

http://localhost:3000/api/devices - exposes the device state objects (JSON), including tags present in the device camera

# Installation

1. Clone this repository, typically with `git clone <url>`
2. Install meteor, meteorite and the needed packages
```
sudo apt-get install npm curl nodejs-legacy
curl https://install.meteor.com/ | sh
sudo -H npm install -g meteorite
mrt add iron-router http-publish collection-api
```

3. 

# Usage
From the command line within the project root folder, run:

```
meteor
```
