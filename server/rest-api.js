// Add access points for `GET`, `POST`, `PUT`, `DELETE`
  HTTP.publish({collection: Classrooms}, function(data) {
    // this.userId, this.query, this.params
    return Classrooms.find({});
  });


// Add access points for `GET`, `POST`, `PUT`, `DELETE`
  HTTP.publish({collection: Devices}, function(data) {
    // this.userId, this.query, this.params
    return Devices.find({});
  });

