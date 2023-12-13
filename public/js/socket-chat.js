var socket = io();

const params = new URLSearchParams(window.location.search);
if(!params.has('nombre')|| !params.has('sala')){
    // window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

const usuario ={
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entarChat', usuario,function(resp){
     console.log('Usuarios Conectados',resp)
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//escuchar cambios de usuarios
socket.on('listaPersona', function(personas){
    console.log('personas',personas);
    
})

socket.on('mensajePrivado', function(mensaje){
    console.log('Mensaje Privado', mensaje);
    
})
