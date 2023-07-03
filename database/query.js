var express = require('express');
const { connection } = require('./conexion.js')

class consultas {
    constructor(tabla) {
        this.name = tabla;
    }
    select(columna, callback) {
        connection.query(`SELECT ${columna} FROM ${this.name}`, callback);
    }
    Insert(thtabla, newDatos, callback) {

        connection.query(`INSERT INTO ${this.name} (${thtabla}) VALUES (${newDatos});`, (callback));
    }
    Delet(columna, parametro, callback) {

        connection.query(`DELETE FROM ${this.name} WHERE ${columna}=${parametro}`, callback);
    }
    Update(datosNuevos, strWhere, callback) {
        
        connection.query(`UPDATE ${this.name} SET ${datosNuevos} WHERE ${strWhere}`, callback);
    }

}
module.exports = { consultas }