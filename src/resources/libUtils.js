
const getLogAlteracao = (userName) => {    
    return `, LOG_ALTERACAO = '(APP) ${userName} - ${getDate()}'`   
}

const getDate = () => {
    let date_ob  = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();

    return day + '/' + month + "/" + year;
}

const formatDateDB = (date) => {
    if (date == undefined)  
        return undefined;


    let date_ob  = new Date(date);
    let day = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();

    return day + '/' + month + "/" + year;
}


const getUpdateFieldCondi = (fieldName, fieldValue, stringField) => {
    let newFieldValue = fieldValue;

    if (fieldValue == undefined)
        return '';

    if (stringField) {
        newFieldValue = `'${fieldValue}'`;
    }
    return `${fieldName} = ${newFieldValue},`
}

const getInserValue = (fieldValue, stringField) => {
    let newFieldValue = fieldValue;

    let emptyString = '0';

    if (stringField) {
        newFieldValue = `'${fieldValue}'`;
        emptyString = `''`;
    }
    return `${fieldValue == undefined ? emptyString : `${newFieldValue}`}`
}


        
module.exports = {
    getLogAlteracao,
    formatDateDB,
    getDate,
    getUpdateFieldCondi,
    getInserValue
}