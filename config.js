//for JSON web tokens - we will undo sessions and we already undid cookies

//will expots as a module, a secret key, that we will use to export the token later, and a mongo url
module.exports = {
    'secretKey': '12345-67890-09876-54321',
    'mongoUrl' : 'mongodb://localhost:27017/nucampsite'
}