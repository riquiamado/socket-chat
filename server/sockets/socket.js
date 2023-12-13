const { Usuarios } = require("../classes/usuarios");
const { io } = require("../server");
const { crearMensaje } = require("../utils/utilidades");

const usuarios = new Usuarios();

io.on("connection", (client) => {
  client.on("entarChat", (data, callback) => {
    console.log(data)
    if (!data.nombre || !data.sala) {
      return callback({
        error: true,
        mensaje: "El nombre/sala es necesario",
      });
    }

     client.join(data.sala);

    const personas = usuarios.agregarPersona(client.id, data.nombre,data.sala);

    // client.broadcast.to(data.sala).emit('listaPersona',usuarios.getPersonasPorSala(data.sala));
    // client.broadcast.to(data.sala).emit('crearMensaje',{
    //     usuario: 'Administrador',
    //     mensaje: `${data.nombre} se unió`
    // });
    client.broadcast.to(data.sala).emit("listaPersona", usuarios.getPersonasPorSala(data.sala));
   console.log(personas)
    callback(usuarios.getPersonasPorSala(data.sala));
  });

   client.on("crearMensaje", (data) => {
      let persona = usuarios.getPersona(client.id);
     const mensaje = crearMensaje(persona.nombre, data.mensaje);
     client.broadcast.to(persona.sala).emit("crearMensaje", mensaje);
   })

  client.on("disconnect", () => {
    let personaBorrada = usuarios.borrarPersona(client.id);
    console.log(personaBorrada)
    client.broadcast.to(personaBorrada.sala).emit("crearMensaje", crearMensaje('Administrador',`${personaBorrada.nombre} abandono el chat`));
    client.broadcast.to(personaBorrada.sala).emit("listaPersona", usuarios.getPersonasPorSala(personaBorrada.sala));
    
  });

  //mensajes privados 
  client.on('mensajePrivado', data => {
    let persona = usuarios.getPersona(client.id);
    client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
  
  })
});

// console.log('Usuario conectado');

// client.emit('enviarMensaje', {
//     usuario: 'Administrador',
//     mensaje: 'Bienvenido a esta aplicación'
// });

// });
