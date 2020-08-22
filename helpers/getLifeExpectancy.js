const lifeExpectancyData = require('./life-expectancy.json');

function getLifeExpectancy(country, ageOfUser) {
    const countryFound = lifeExpectancyData.find(countryObj => {
        if (countryObj.Country.toLowerCase() === country.toLowerCase()) {
            return true;
        }
    })

    let lifeExpectancy = countryFound['Life expectancy'];
    const yearsRemaining = lifeExpectancy - ageOfUser;
    return yearsRemaining;
}
module.exports = getLifeExpectancy;
