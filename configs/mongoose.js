const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.DB_HOST, {});
        console.log('connection successful');
    } catch(e) {console.log(e)}
}


module.exports = {connect};