var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')
const consulta = require('../database/query.js')
const funsiones = require('../database/funsiones.js')
const tabla = new consulta.consultas('medicos')
const columnaCita = "Id_medico" //Nombre de la columna que posee la llave foranea entre la tabla de citas y medicos


router.get('/', function (req, res, next) {
    tabla.select("*", (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('medicos', { title: 'medicos', medicos: results, opcion: 'disabled', estado: true })
        }
    });
});

router.get('/enviar/:clave', function (req, res, next) {
    const clave = req.params.clave;
    tabla.select("*", (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('medicos', { title: 'medicos', claveSeleccionada: clave, medicos: results, opcion: 'disabled', estado: false })
        }
    });
});
//Agregar Medico
router.get('/agregar-medico', function (req, res, next) {
    tabla.select("especialidad", (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            let especialidades = ['Medicina general', 'Cardiología', 'Medicina interna', 'Dermatología', 'Rehabilitación física', 'Psicología', 'Odontología', 'Radiología']
            let resultsEspecialidades = results.map(objeto => objeto.especialidad);//separar packete 
            let resultsSinRepetidos = especialidades.filter((elemento) => {//filtrar repetidos
                return !resultsEspecialidades.includes(elemento);
            });
            res.render('registro-medicos', { layout: 'registro', especialidades: resultsSinRepetidos })
        }
    });
});

//Agregar medicos
router.post('/agregar', (req, res) => {
    const datos = funsiones.StringAuto(req.body)
    const thMedicos = 'nombres,apellidos,cedula,consultorio,correo,especialidad' //orden del formulario
    console.log(datos)
    tabla.Insert(thMedicos, datos, (error, results) => {
        if (error) {
            console.log("Ocurrio un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
        } else {
            res.redirect('/medicos');
        }
    });
})

//eliminar medicos
router.get('/eliminar/:cedula', function (req, res, next) {
    const cedula = req.params.cedula
    const columna = "cedula"
    const tablaCita = new consulta.consultas('cita_medica')
    tablaCita.Delet(columnaCita, cedula, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            tabla.Delet(columna, cedula, (error, results) => {
                //connection.query(`DELETE FROM mascotas WHERE cedula_duenio=${cedula}`, (error, results) => {
                if (error) {
                    console.log("Error en la consulta", error)
                    res.status(500).send("Error en la consulta")
                } else {
                    res.redirect('/medicos')
                }
            });
        }
    });
    /*connection.query(`DELETE FROM cita_medica WHERE id_medico=${cedula}`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            connection.query(`DELETE FROM medicos WHERE cedula=${cedula}`, (error, results) => {
                if (error) {
                    console.log("Error en la consulta", error)
                    res.status(500).send("Error en la consulta")
                } else {
                    res.redirect('/medicos')
                }
            });
        }
    });*/
});

router.post('/actualizar/:cedula', (req, res) => {
    const cedula = req.params.cedula;
    //const nombres = req.body.nombres;
   // const apellidos = req.body.apellidos;
    //const especialidad = req.body.especialidad;
    //const consultorio = req.body.consultorio;
    //const correo = req.body.correo;

    const datos = funsiones.StringUpdate(req.body)
    console.log(datos)
    const strWhere = 'cedula=' + req.params.cedula;
    tabla.Update(datos, strWhere, (error, results) => {
        //connection.query(`UPDATE medicos SET nombres='${nombres}', apellidos='${apellidos}', especialidad='${especialidad}', consultorio=${consultorio}, correo='${correo}' WHERE cedula=${cedula}`, (error, result) => {
        if (error) {
            console.log("Ocurrio un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
        } else {
            res.redirect('/medicos');
        }
    });
})

module.exports = router;