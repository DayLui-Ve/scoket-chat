const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios')

const { crearMensaje } = require('../utilidades/utilidades')

const usuarios = new Usuarios()

io.on('connection', (client) => {

    client.on('entrarChat', function(data, callback) {

        console.log('entrarChat@data', data);

        if (!data.nombre || !data.sala) {
            return callback({
                err: false,
                mensaje: 'El nombre/sala es necesario'
            })
        }

        client.join(data.sala)

        usuarios.agregarPersona(client.id, data.nombre, data.sala)

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala))

        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió`))

        callback(usuarios.getPersonasPorSala(data.sala))

    })

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id)

        console.log('disconnect@personaBorrada', personaBorrada);

        if (personaBorrada) {

            const mensaje = crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat`)

            client.broadcast.to(personaBorrada.sala).emit('crearMensaje', mensaje)

        }

        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala))

    })

    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje(persona.nombre, data.mensaje)

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)

        callback(mensaje)

    })

    // mensaje privado
    client.on('mensajePrivado', (data) => {

        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje(persona.nombre, data.mensaje)

        client.broadcast.to(data.para).emit('mensajePrivado', mensaje)

    })

});