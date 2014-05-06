A first attempt at doing a "orchestrable classroom" online application using the Meteor framework

# Features
Current prototype concentrates on having a **reactive visualization** of the classroom/device state, and exposing a **REST API** for such a state, in the form:

http://localhost:3000/api/classrooms - exposes the global classroom state objects, including devices (lamps) in the classroom

http://localhost:3000/api/devices - exposes the device state objects, including tags present in the device camera

# Usage
From the command line within the project root folder, run:

```
meteor
```
