const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if (whitelist.indexOf(req.header('Origin')) !==-1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
//when we call cors, it will return us to a middleware fx with access return fx....
exports.corsWithOptions = cors(corsOptionsDelegate);
//the above will check if incoming req returns to those local hosts we have above, and if so, it will send back the cors header of access control cors origin