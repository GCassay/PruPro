
// Cargar módulos
var rolRecolector = require('rol.recolector');
var rolRecargador = require('rol.recargador');

module.exports.loop = function () {
   
   // Limpiar memoria de creeps eliminados o que ya finalizaron su ciclo de vida
   for(var nombre in Memory.creeps) {
        if(!Game.creeps[nombre]) {
            delete Memory.creeps[nombre];
        }
    }
    
    // Seleccionar sólo creeps recolectores
    var recolectores = _.filter(Game.creeps, (creep) => creep.memory.role == 'recolector'); 
    // Si la cantidad actual es menor a 2, crear un nuevo recolector
    if(recolectores.length < 2) {
        var nuevo = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'recolector'});
    }
    
    // Diferenciar creeps por su rol y asignar comportamiento
    for(var nombre in Game.creeps) {
        var minion = Game.creeps[nombre];
        if(minion.memory.role == 'recolector') {
            rolRecolector.run(minion);
        }
        if(minion.memory.role == 'recargador') {
            rolRecargador.run(minion);
        }
    }
}
