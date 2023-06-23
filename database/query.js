var express = require('express');
const { connection } = require('./conexion.js')

class consultas {
    constructor(tabla) {
        this.name = tabla;
    }
    select(columna,callback) {
        connection.query(`SELECT ${columna} FROM ${this.name}`, callback);
    }

}
module.exports = { consultas }