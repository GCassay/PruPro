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
var rolRecargadorBot = require('rol.recargadorBot'); // Obtener energía de la fuente inferior para transferir a estructuras
var rolRecargadorMid = require('rol.recargadorMid'); // Obtener energía de la fuente central para transferir a estructuras
var rolRecargadorTop = require('rol.recargadorTop'); // Obtener energía de la fuente superior para transferir a estructuras
var rolConstructorBot = require('rol.constructorBot'); // Obtener energía de la fuente inferior para transferir a estructuras
var rolConstructorMid = require('rol.constructorMid'); // Obtener energía de la fuente central para transferir a estructuras
var rolConstructorTop = require('rol.constructorTop'); // Obtener energía de la fuente superior para transferir a estructuras

module.exports.loop = function () {

    // Control de tiempo y ticks de la prueba
    if(Game.time == 1){ // Se inicia el contador desde 1 ya que eventualmente la consola del simulador no muestra el registro del tick 0
        console.log('INICIO DE LA PRUEBA');
        if(!Memory.datos){ // Se guarda el Epoch Time del instante en que se posiciona el primer Spawn
            Memory.datos = {
              epoch: String(Date.now()),
              controlador: false, // Si el controlador es level 2 y se pueden crear extensiones
              extensionX: 32, // Coordenada x de Extensión
              extensionY: 21, // Coordenada y de Extensión
              contenedorX: 34, // Coordenada x de Contenedor
              contenedorY: 23 // Coordenada y de Contenedor
            };
        }
        // Crear ConstructionSite para 1 Contenedor
        Game.rooms.sim.createConstructionSite(34, 23, STRUCTURE_CONTAINER); 
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
        var constructoresMid = _.filter(Game.creeps, (creep) => creep.memory.role == 'constructorMid');
        var constructoresBot = _.filter(Game.creeps, (creep) => creep.memory.role == 'constructorBot');
        var constructoresTop = _.filter(Game.creeps, (creep) => creep.memory.role == 'constructorTop');
        var recargadoresMid = _.filter(Game.creeps, (creep) => creep.memory.role == 'recargadorMid');
        var recargadoresBot = _.filter(Game.creeps, (creep) => creep.memory.role == 'recargadorBot');
        var recargadoresTop = _.filter(Game.creeps, (creep) => creep.memory.role == 'recargadorTop');
        var enObras = Game.spawns.Central.room.find(FIND_CONSTRUCTION_SITES);
        
        // Si el Controlador aún no es level 2
        if(Game.spawns.Central.room.controller.level < 2){
            if(recolectores.length < 2) { // Crear recargadores para transferir energía al Controlador
                var Recolector = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'recolector'});
            }
        }
        // Si el Controlador es level 2
        else if(Game.spawns.Central.room.controller.level == 2){
            
            // Si acaba de subir de nivel y aún no se guardó el progreso en Memory.datos
            if(!Memory.datos || Boolean(Memory.datos.controlador) == false){
            
                // Crear ConstructionSite para 1 Extensión
                Game.rooms.sim.createConstructionSite(32, 21, STRUCTURE_EXTENSION); 
    
                // Guardar confirmación
                Memory.datos.controlador = true;
                
                // Reciclar los creeps que subieron el Controlador
                // Asignar rol recolector
                for(var nombre in Game.creeps) { 
                    var minion = Game.creeps[nombre];
                    minion.memory.role = 'constructorMid';
                } 
            }
            // Si ya se guardó el progreso en Memory.datos
            else{
                
                switch(enObras.length){
                
                    case 2: // Si ambas estructuras están en construcción, comenzar por la Extensión
                        if(constructoresMid.length < 3) { // Mantener activos 3 constructores centrales
                            var cm = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'constructorMid'});
                        }
                        else if(constructoresBot.length < 3) { // Mantener activos 3 constructores inferiores
                            var cb = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'constructorBot'});
                        }
                        else if(constructoresTop.length < 1) { // Mantener activo 1 constructor superior
                            var ct = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], 'Auxiliar', {role: 'constructorTop'});
                        }
                        break;
                    
                    case 1: // Al finalizar la extensión, trabajar en el Contenedor
                        if(constructoresMid.length < 3) { // Mantener activos 3 constructores centrales
                            var cm = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'constructorMid'});
                        }
                        else if(constructoresBot.length < 3) { // Mantener activos 3 constructores inferiores
                            var cb = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'constructorBot'});
                        }
                        else if(constructoresTop.length < 1) { // Mantener activo 1 constructor superior
                            var ct = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], 'Auxiliar', {role: 'constructorTop'});
                        }
                        break;
                        
                    case 0: // Al terminar de construir ambas estructuras, dedicar todos los creeps transferirles energía
                    
                        for(var nombre in Game.creeps) { 
                            var minion = Game.creeps[nombre];
                            if(minion.memory.role = 'constructorMid'){
                                   minion.memory.role = 'recargadorMid';
                            }
                        }
                        for(var nombre in Game.creeps) { // Convertir constructor inferior en recargador inferior
                            var minion = Game.creeps[nombre];
                            if(minion.memory.role = 'constructorBot'){
                                minion.memory.role = 'recargadorBot';
                            }
                        }
                        var minion = Game.creeps['Auxiliar'];
                        minion.memory.role = 'recargadorTop'; // Convertir constructor superior en recargador superior
                        
                        if(recargadoresMid.length < 3) { // Mantener activos 3 constructores inferiores
                            var rm = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'recargadorMid'});
                        }
                        else if(recargadoresBot.length < 3) { // Mantener activos 3 constructores inferiores
                            var rb = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'recargadorBot'});
                        }
                        else if(recargadoresTop.length < 1) { // Mantener activo 1 constructor superior
                            var rp = Game.spawns['Central'].createCreep([WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'recargadorTop'});
                        }
                        break;
                }
            }
        }
        else{} // Si el Controlador va a subir más de level 2
        
        // Diferenciar creeps por su rol y asignar comportamiento
        for(var nombre in Game.creeps) {
            var minion = Game.creeps[nombre];
            if(minion.memory.role == 'recargadorBot') {
                rolRecargadorBot.run(minion);
            }
            if(minion.memory.role == 'recargadorMid') {
                rolRecargadorMid.run(minion);
            }
            if(minion.memory.role == 'recargadorTop') {
                rolRecargadorTop.run(minion);
            }
            if(minion.memory.role == 'constructorBot') {
                rolConstructorBot.run(minion);
            }
            if(minion.memory.role == 'constructorMid') {
                rolConstructorMid.run(minion);
            }
            if(minion.memory.role == 'constructorTop') {
                rolConstructorTop.run(minion);
            }
        }
    }
}
