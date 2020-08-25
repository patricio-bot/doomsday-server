const diseases = require('../helpers/diseases.json')

function generateSins(isSmoker, isDrinker, health) {

    const hasSins = []
    if (isSmoker) {
        const d = getRandomDisease('isSmoker')
        hasSins.push(d)
    } else if (isDrinker) {
        const d = getRandomDisease('isDrinker')
        hasSins.push(d)
    }
    const d = getRandomDisease(health)
    hasSins.push(d)
    return hasSins
}

function getRandomDisease(categoryName) {
    const category = diseases[categoryName]

    const categoryLength = category.length
    const randomIndex = Math.floor(Math.random() * categoryLength)

    const randomDisease = category[randomIndex]
    return randomDisease
}
module.exports = generateSins


//copiar list tasks
//filtrar retos xa k no se repiten
//usando lista nueva y lenght crear indece aleatorio con math floor y random usando lenght de la lista filtrada
//con el indice sacar el valor de la lista filtrada
//enviarlo a backend
//una vez k user update enviarlo al frontend