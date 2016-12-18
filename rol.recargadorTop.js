var rolRecargadorTop = { 

	run: function(creep) {
	    creep.say("R TOP");

        if(creep.memory.transferir && creep.carry.energy == 0) { // Creep en Modo Transferir / Sin energía
            creep.memory.transferir = false; // Pasar a Modo Recolección para obtener más energía
            //creep.say('Recolectar');
        }
        if(!creep.memory.transferir && creep.carry.energy == creep.carryCapacity) { // Creep en Modo Recolección / Full energía
            creep.memory.transferir = true; // Pasar a Modo Transferir para llevar energía a un contenedor
            //creep.say('Transferir');
        }
        if(creep.memory.transferir) { // Creep en Modo Transferir / Con energía
	    
            // Si la extensión no está llena depositar la energía
            var punto = Game.rooms.sim.getPositionAt(32,21);
            var fuente = punto.findClosestByRange(FIND_STRUCTURES);
            if(fuente.energy < 50){
                var extension = creep.room.find(FIND_STRUCTURES,{filter: (i)=> {return i.structureType==STRUCTURE_EXTENSION}})
                // Desplazarse hasta ella si no está en el rango y transferirle energía
                if(creep.transfer(extension[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { 
                    creep.moveTo(extension[0]);
                }
            }
	        // Si la extensión está llena depositar la energía en el Spawn
	        else{
	           if(creep.transfer(Game.spawns['Central'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['Central']);
                } 
	        }
        }
        else { // Modo Recolección 
            var punto = Game.rooms.sim.getPositionAt(35,2);
            var fuente = punto.findClosestByRange(FIND_SOURCES_ACTIVE);
            // Si no está en el rango de la fuente, desplazarse hasta ella
            if(creep.harvest(fuente) == ERR_NOT_IN_RANGE) {
                creep.moveTo(fuente);
            }    
		}
	}
};

module.exports = rolRecargadorTop;
