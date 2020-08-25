const diseaseData = require('./sins.json');

function getDisease(health) {
    const diseaseFound = diseaseData.find(sinObj => {
        if (sinObj.causes.includes(health)) {
            return true;
        }
    })
    let userSin = diseaseFound.disease;
    return userSin;
}
module.exports = getDisease;