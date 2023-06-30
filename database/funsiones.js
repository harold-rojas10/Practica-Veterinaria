function StringAuto(Info) {
    let datos = Object.values(Info)
    for (let i = 0; i < datos.length; i++) {
        let element = datos[i];
        if (isNaN(element) ) {
            console.log(`${element} es un string`)
            datos [i] = `'${element}'`
        }else{
            console.log(`${element} es un numero`)
        }
        
    }
    let datosTostring = datos.join();
    //console.log(datosTostring)
    return datosTostring
}

module.exports = { StringAuto }