const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Case = require('./models/Case');
const Property = require('./models/Property');
const CustodyLog = require('./models/CustodyLog');
const DisposalRecord = require('./models/DisposalRecord');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');

        console.log('Clearing Database...');

        await User.deleteMany({});
        console.log('Users Cleared');

        await Case.deleteMany({});
        console.log('Cases Cleared');

        await Property.deleteMany({});
        console.log('Properties Cleared');

        await CustodyLog.deleteMany({});
        console.log('Custody Logs Cleared');

        await DisposalRecord.deleteMany({});
        console.log('Disposal Records Cleared');

        console.log('All dummy data removed successfully.');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
