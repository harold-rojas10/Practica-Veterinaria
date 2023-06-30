var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')
const consulta = require('../database/query.js')
const funsiones = require('../database/funsiones.js')



router.get('/', function (req, res, next) {
    connection.query('SELECT cm.id,cm.fecha, cm.id_mascota, mas.nombre, med.nombres, med.apellidos, med.consultorio FROM cita_medica cm, mascotas mas, medicos med WHERE cm.id_mascota = mas.cedula_duenio AND cm.id_medico= med.cedula', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('citas', { title: 'citas', citas: results })
        }
    });
});

router.get('/agregar-cita', function (req, res, next) {
    let tabla = new consulta.consultas('mascotas')
    tabla.select("cedula_duenio", (error, results) => {
        //connection.query('SELECT cedula_duenio FROM mascotas', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            let tabla = new consulta.consultas('medicos')
            tabla.select("especialidad", (error, results2) => {
                //connection.query('SELECT especialidad FROM medicos', (error, results2) => {
                if (error) {
                    console.log("Error en la consulta", error)
                    res.status(500).send("Error en la consulta")
                } else {
                    res.render('registro-citas', { layout: 'registro', mascotas: results, medicos: results2 })
                }
            });
        }
    });
});

router.post('/agregar', function (req, res, next) {
    //const cedulaDuenio = req.body.cedula;
    //const fecha = req.body.fecha;
    const especialidad = req.body.especialidad;
    connection.query(`SELECT cedula FROM medicos WHERE especialidad='${especialidad}'`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            const thCitas = 'id_mascota, id_medico, fecha'
            const citaInfo = {
                cedulaDuenio: req.body.cedula,
                cedulaMedico: results[0].cedula,
                fecha: req.body.fecha
            };
            const datos = funsiones.StringAuto(citaInfo)
            console.log(datos)
            let tabla = new consulta.consultas('cita_medica')
            //connection.query(`INSERT INTO cita_medica (id_mascota, id_medico, fecha) VALUES (${cedulaDuenio},${cedulaMedico}, '${fecha}')`, (error, result) =>
            tabla.Insert(thCitas, datos, (error, results) => {
                if (error) {
                    console.log("Ocurrio un error en la ejecución", error)
                    res.status(500).send("Error en la consulta");
                } else {
                    res.redirect('/citas');
                }
            });
        }
    });
})
//eliminar citas
router.get('/eliminar/:id', function (req, res, next) {
    const id = req.params.id
    connection.query(`DELETE FROM cita_medica WHERE id=${id}`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.redirect('/citas')
        }
    });
});

module.exports = router;