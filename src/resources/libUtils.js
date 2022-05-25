
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


const getDateDB = () => {
    let date_ob  = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();

    return month + '/' + day + "/" + year;
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

    return month + '/' + day + "/" + year;
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

const getUpdateFieldBool = (fieldName, fieldValue) => {    

    if (fieldValue == undefined)
        return '';

    return `${fieldName} =  '${fieldName ? 'S' : 'N'}',`
}

const getUpdateFieldBoolInt = (fieldName, fieldValue) => {    

    if (fieldValue == undefined)
        return 0;

    return `${fieldName} =  ${fieldName ? 1 : 0},`
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

const getInserValueBoolean = (fieldValue) => {    
    let emptyString = 'N';

    return `'${fieldValue == undefined ? emptyString : `${fieldValue ? 'S' : 'N'}`}'`
}

const getInserValueBooleanInt = (fieldValue) => {    
    let emptyString = 0;

    return `${fieldValue == undefined ? emptyString : `${fieldValue ? 1 : 0}`}`
}
        
module.exports = {
    getLogAlteracao,
    formatDateDB,
    getDate,
    getUpdateFieldCondi,
    getInserValue,
    getUpdateFieldBool,
    getUpdateFieldBoolInt,
    getInserValueBoolean,
    getInserValueBooleanInt,
    getDateDB
}