var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')
const consulta = require('../database/query.js')
const funsiones = require('../database/funsiones.js')
const tabla = new consulta.consultas('mascotas')
const columnaCita = "id_mascota" //Nombre de la columna que posee la llave foranea entre la tabla de citas y mascotas



router.get('/', function (req, res, next) {
    tabla.select("*", (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('mascotas', { title: 'mascotas', mascotas: results, opcion: 'disabled', estado: true })
        }

    })
});
//Ruta del boton editar
router.get('/enviar/:clave', function (req, res, next) {
    const clave = req.params.clave;
    tabla.select("*", (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('mascotas', { title: 'mascotas', claveSeleccionada: clave, mascotas: results, opcion: 'disabled', estado: false })
        }
    });
});


router.get('/agregar-mascota', function (req, res, next) {
    res.sendFile('registro-mascotas.html', { root: 'public' })
});
//Agregar mascotas
router.post('/agregar', (req, res) => {
    const datos = funsiones.StringAuto(req.body)
    const thMascotas = 'nombre,nombre_duenio,cedula_duenio,edad,telefono_duenio'
    //const cedula = req.body.cedula
    //const nombre = req.body.mascota
    //const nombre_duenio = req.body.duenio
    //const edad = req.body.edad
    //const telefono = req.body.telefono
    //connection.query(`INSERT INTO mascotas (${thMascotas}) VALUES (${datos});`, (error, results)
    console.log(datos)
    tabla.Insert(thMascotas, datos, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.redirect('/mascotas')
        }
    });

})
//eliminar macotas
router.get('/eliminar/:cedula', function (req, res, next) {
    const cedula = req.params.cedula
    const columna="cedula_duenio"
    const tablaCita = new consulta.consultas('cita_medica')
    //connection.query(`DELETE FROM cita_medica WHERE id_mascota=${cedula}`, (error, results) => 
    tablaCita.Delet(columnaCita, cedula, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            tabla.Delet(columna, cedula, (error, results) =>{
                //connection.query(`DELETE FROM mascotas WHERE cedula_duenio=${cedula}`, (error, results) => {
                    if (error) {
                        console.log("Error en la consulta", error)
                        res.status(500).send("Error en la consulta")
                    } else {
                        res.redirect('/mascotas')
                    }
                });
        }
    });
});

router.post('/actualizar/:cedula', (req, res) => {
    //const nombre = req.body.mascota;
    //const nombre_duenio = req.body.duenio;
    //const edad = req.body.edad;
    //const telefono = req.body.telefono;
    const datos = funsiones.StringUpdate(req.body)
    console.log(datos)
    const strWhere = 'cedula_duenio='+ req.params.cedula;
    tabla.Update(datos,strWhere,(error,results)=>{
    //connection.query(`UPDATE mascotas SET ${datos} WHERE ${strWhere}`, (error, result) => {
        if (error) {
            console.log("Ocurrio un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
        } else {
            res.redirect('/mascotas');
        }
    });
})
module.exports = router;