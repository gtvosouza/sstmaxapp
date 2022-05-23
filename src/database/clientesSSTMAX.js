
const optionsOmega = {
    database: 'C:\\MaxOmegaAPP_omega\\Data\\MAXOMEGA.FDB',
    user: 'SYSDBA',
    password: 'masterkey',
    pageSize : 4096,
    host: '10.1.2.77',
};

const optionsAstra = {
    database: 'C:\\MaxOmegaAPP_astrabalhador\\Data\\ASTRA.fdb',
    user: 'SYSDBA',
    password: 'masterkey',
    pageSize : 4096,
    host: '10.1.2.77',
};

const databases = [
                    {codigo: "0001", nome: "Omega Serviçoes Médicos", options: optionsOmega},
                    {codigo: "0002", nome: "ASTRABALHADOR", options: optionsAstra}  
                  ]

module.exports = {databases}