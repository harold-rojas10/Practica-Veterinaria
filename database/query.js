var express = require('express');
const { connection } = require('./conexion.js')

class consultas {
    constructor(tabla) {
        this.name = tabla;
    }
    select(columna,callback) {
        connection.query(`SELECT ${columna} FROM ${this.name}`, callback);
    }
    Insert(thtabla,newDatos,callback){
        let mensaje = `INSERT INTO ${this.name} (${thtabla}) VALUES (${newDatos});`
        console.log(mensaje)
        connection.query(`INSERT INTO ${this.name} (${thtabla}) VALUES (${newDatos});`, (callback));
    }

}
module.exports = { consultas }