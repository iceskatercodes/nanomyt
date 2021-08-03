'use strict';

let schema = {};

schema.user = {
  type: "object",
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    password1: { type: 'string' },
  },
  required:["firstname","email","password","password1"]
}

schema.user_login = {
  type: "object",
  properties: {
     email: { type: 'string' },
    password: { type: 'string' }
  },
  required:["email","password"]

}

module.exports = schema