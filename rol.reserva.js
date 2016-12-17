var rolReserva = {
    
	run: function(creep) {

        var enObras = Game.spawns.Central.room.find(FIND_CONSTRUCTION_SITES);
        
        switch(enObras.length){
            
            case 2: // Si aún se está construyendo el primer Contenedor, recargar Spawn para generar más reservas
        	    // Si el creep lleva menos energía de la que puede transportar, intenta obtener más
                if(creep.carry.energy < creep.carryCapacity) {
                    
                    var punto = Game.rooms.sim.getPositionAt(43,44);
                    var fuente = punto.findClosestByRange(FIND_SOURCES_ACTIVE);
                    // Si no está en el rango de LA fuente, desplazarse hasta ella
                    if(creep.harvest(fuente) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(fuente);
                    }
                }
                // Si el creep está lleno, dirigirse a una estructura
                else{
                    // Priorizar transferencia al contenedor
                    var p = Game.rooms.sim.getPositionAt(34,23);
                    var contenedor = p.findClosestByRange(FIND_STRUCTURES);
                    if(contenedor){
                        if(creep.transfer(contenedor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(contenedor);
                        }
                    }
                    // Si el contenedor aún se está construyendo, transferir energía al Spawn
                    else if(creep.transfer(Game.spawns['Central'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.spawns['Central']);
                    }
                }
                break;
                
            case 1: // Si el primer Contenedor ya está finalizado
            
                if(creep.memory.construir && creep.carry.energy == 0) { // Creep en Modo Construcción / Sin energía
                    creep.memory.construir = false; // Pasar a Modo Recolección para obtener más energía
                    creep.say('Recolectar');
                }
                if(!creep.memory.construir && creep.carry.energy == creep.carryCapacity) { // Creep en Modo Recolección / Full energía
                    creep.memory.construir = true; // Pasar a Modo Construcción para comenzar a construir
                    creep.say('Construir');
                }
                if(creep.memory.construir) { // Creep en Modo Construcción / Con energía
                    var targets = creep.room.find(FIND_CONSTRUCTION_SITES); // Localizar punto de construcción y construir
                    if(targets.length) {
                        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) { // Desplazarse hasta el punto si no está en el rango
                            creep.moveTo(targets[0]);
                        }
                    }
                }
                else { // Modo Recolección 
                    var punto = Game.rooms.sim.getPositionAt(43,44);
                    var fuente = punto.findClosestByRange(FIND_SOURCES_ACTIVE);
                    // Si no está en el rango de LA fuente, desplazarse hasta ella
                    if(creep.harvest(fuente) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(fuente);
                    }
                }
                break;
                
            case 0: // Si el segundo Contenedor está finalizado, transferir energía
                if(creep.memory.transferir && creep.carry.energy == 0) { // Creep en Modo Transferir / Sin energía
                    creep.memory.transferir = false; // Pasar a Modo Recolección para obtener más energía
                    creep.say('Recolectar');
                }
                if(!creep.memory.transferir && creep.carry.energy == creep.carryCapacity) { // Creep en Modo Recolección / Full energía
                    creep.memory.transferir = true; // Pasar a Modo Transferir para llevar energía a un contenedor
                    creep.say('Transferir');
                }
                if(creep.memory.transferir) { // Creep en Modo Transferir / Con energía
                    // Localizar Contenedor
                    var contenedor = creep.room.find(FIND_STRUCTURES,{filter: (i)=> {return i.structureType==STRUCTURE_CONTAINER}})
                    // Desplazarse hasta él si no está en el rango
                    if(creep.transfer(contenedor[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { 
                        creep.moveTo(contenedor[0]);
                    }
                }
                else { // Modo Recolección 
                    var punto = Game.rooms.sim.getPositionAt(43,44);
                    var fuente = punto.findClosestByRange(FIND_SOURCES_ACTIVE);
                    // Si no está en el rango de LA fuente, desplazarse hasta ella
                    if(creep.harvest(fuente) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(fuente);
                    }
        		}                
        }
    }
};

module.exports = rolReserva;
