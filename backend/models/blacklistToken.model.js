const mongoosee = require('mongoose');
const blacklistTokenSchema = new mongoosee.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d' // Token will expire after 1 day
    }
}, {
    timestamps: true
});

module.exports = mongoosee.model('BlacklistToken', blacklistTokenSchema);