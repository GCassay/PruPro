/**************************************************************************
 README
***************************************************************************
 1. Coordenadas para el primer Spawn -> X:25 Y:25
 2. Nombre asignado al primer Spawn -> Central
 3. Activar 'Show flags' en DISPLAY OPTIONS
 4. Contador de ticks y total de minutos en Consola
***************************************************************************/

// Cargar módulos
var rolRecolector = require('rol.recolector'); // Obtener energía para transferir al Spawn
var rolRecargador = require('rol.recargador'); // Obtener energía para transferir a otras estructuras
var rolRecargador2 = require('rol.recargador2'); // Obtener energía para transferir a otras estructuras
var rolConstructor = require('rol.constructor'); // Obtener energía y construir el primer Contenedor
var rolConstructor2 = require('rol.constructor2'); // Obtener energía y construir el segundo Contenedor

module.exports.loop = function () {

    // Control de tiempo y ticks de la prueba
    if(Game.time == 1){ // Se inicia el contador desde 1 ya que eventualmente la consola del simulador no muestra el registro del tick 0
        console.log('INICIO DE LA PRUEBA');
        if(!Memory.datos){ // Se guarda el Epoch Time del instante en que se posiciona el primer Spawn
            Memory.datos = {
              epoch: String(Date.now()),
              controlador: false
            };
        }
        // Crear ConstructionSites para 2 Contenedores
        Game.rooms.sim.createConstructionSite(33, 23, STRUCTURE_CONTAINER); 
        Game.rooms.sim.createConstructionSite(40, 44, STRUCTURE_CONTAINER); 
    }
    
    // Fin de la prueba (tick 2000)
    if(Game.time == 2000){
        var final = parseInt(Date.now()); // Se obtiene el Epoch Time del instante en que se alcanzan los 2000 ticks
        var inicio = parseInt(Memory.datos.epoch); // Se recoge el Epoch Time de inicio
        var tiempo = final - inicio; // Se calculan los milisegundos transcurridos
        // Se usa como medida de tiempo el minuto
        var tiempo = Math.floor(tiempo / 60000); // Se convierten milisegundos a minutos
        console.log('TIEMPO TRANSCURRIDO: '+ tiempo +' minutos');
        
        // Se genera un elemento flag en el mapa indicando el final del contador
        Game.rooms.sim.createFlag(25, 25, 'Tiempo Finalizado', COLOR_WHITE); 
        
        // Eliminar creeps
        for(var nombre in Game.creeps) {
            var minion = Game.creeps[nombre];
            minion.suicide();
        }
    }

   // Limpiar memoria de creeps eliminados o que ya finalizaron su ciclo de vida
   for(var nombre in Memory.creeps) {
        if(!Game.creeps[nombre]) {
            delete Memory.creeps[nombre];
        }
    }
    
    // Actividad entre ticks 1 y 1999
    if(Game.time > 0 && Game.time < 2000){
    
        console.log(Game.time); // Contador
        
        // Filtros de Creeps por rol
        var recolectores = _.filter(Game.creeps, (creep) => creep.memory.role == 'recolector');
        var recargadores = _.filter(Game.creeps, (creep) => creep.memory.role == 'recargador');
        var recargadores2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'recargador2');
        var constructores = _.filter(Game.creeps, (creep) => creep.memory.role == 'constructor');
        var constructores2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'constructor2');
        var enObras = Game.spawns.Central.room.find(FIND_CONSTRUCTION_SITES);
        
        // Si el Controlador aún no es level 2
        if(Game.spawns.Central.room.controller.level < 2){
            if(recargadores.length < 2) { // Crear recargadores para transferir energía al Controlador
                var Recargador = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'recargador'});
            }
        }
        // Si el Controlador es level 2
        else if(Game.spawns.Central.room.controller.level == 2){
            
            // Si acaba de subir de nivel y aún no se guardó el progreso en Memory.datos
            if(Memory.datos && Boolean(Memory.datos.controlador) == false){
            
                // Generar Extensiones
                Game.rooms.sim.createConstructionSite(32, 21, STRUCTURE_EXTENSION); 
                Game.rooms.sim.createConstructionSite(34, 23, STRUCTURE_EXTENSION); 
    
                // Guardar confirmación
                if(Boolean(Memory.datos.controlador) == false){ 
                    Memory.datos.controlador = true;
                }
                
                // Reciclar los creeps que subieron el Controlador
                // Asignarles rol constructor para iniciar construcción de Extensiones
                for(var nombre in Game.creeps) { 
                    var minion = Game.creeps[nombre];
                    minion.memory.role = 'constructor';
                } 
            }
            // Si ya se guardó el progreso en Memory.datos
            else{
                if(constructores.length < 3) { // Mantener activos 3 constructores
                    var Constructor = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'constructor'});
                }
                else if(constructores2.length < 3) { // Mantener activos 3 constructores
                    var Constructor2 = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'constructor2'});
                }
            }
        }
        else{} // Si el Controlador va a subir más de level 2



        /*
        if(Game.time > 1){
        // Número de estructuras(Contenedores) en construcción
        switch(enObras.length){
            
            case 2: // Comenzar a construir el primer Contenedor
            
                if(recolectores.length < 3) { // Recolectores para agilizar la creación de creeps
                    var Recolector = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'recolector'});
                }
                else if(recolectores.length == 3 && constructores.length == 0){
                   for(var nombre in Game.creeps) {
                        var minion = Game.creeps[nombre];
                        if(minion.memory.role == 'recolector') {
                            minion.memory.role = 'constructor';
                        }
                    }  
                }
                else{
                   for(var nombre in Game.creeps) {
                        var minion = Game.creeps[nombre];
                        if(minion.memory.role == 'recolector') {
                            minion.memory.role = 'constructor2'; 
                        }
                    } 
                }*/
                /*
                else if(Game.time > 2){ // Asegurar que ya se generaron los ConstructionSite
                    if(constructores.length < 3){  
                        var nuevoConstructor = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'constructor'});
                    }
                    else{
                        if(constructores2.length < 3){  
                            var nuevoConstructor2 = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'constructor2'});
                        }
                    }
                }*//*
                break;
                
            case 1: // Comenzar a construir el segundo Contenedor, llenar el primero y subir de nivel el Controlador
            
                // Reciclar los 3 constructores iniciales a recargadores
                for(var nombre in Game.creeps) {
                    var minion = Game.creeps[nombre];
                    if(minion.memory.role == 'constructor') {
                        minion.memory.role = 'recargador'; // Prioridad subir de Controlador a lv 2
                    }
                }
                if(constructores2.length < 3){  
                    var nuevoConstructor2 = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'constructor2'});
                }
                else if(recargadores.length < 3){ // Mantener 3 recargadores trabajando
                    var nuevoRecargador = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'recargador'});
                }
                else if(recolectores.length < 3){ // Mantener 3 recargadores trabajando
                    var nuevoRecolector = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'recolector'});
                }
                break;
                
            case 0:
                
                // Reciclar los 3 constructores iniciales a recargadores
                for(var nombre in Game.creeps) {
                    var minion = Game.creeps[nombre];
                    if(minion.memory.role == 'constructo2') {
                        minion.memory.role = 'recargador2'; // Prioridad subir de Controlador a lv 2
                    }
                }
                if(recargadores2.length < 3){ // Mantener 3 recargadores trabajando
                    var nuevoRecargador2 = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'recargador2'});
                }
                break;
        }
        }*/
        
        // Diferenciar creeps por su rol y asignar comportamiento
        for(var nombre in Game.creeps) {
            var minion = Game.creeps[nombre];
            if(minion.memory.role == 'recolector') {
                rolRecolector.run(minion,constructores.length);
            }
            if(minion.memory.role == 'recargador') {
                rolRecargador.run(minion);
            }
            if(minion.memory.role == 'recargador2') {
                rolRecargador2.run(minion);
            }
            if(minion.memory.role == 'constructor') {
                rolConstructor.run(minion);
            }
            if(minion.memory.role == 'constructor2') {
                rolConstructor2.run(minion);
            }
        }
    }
}
