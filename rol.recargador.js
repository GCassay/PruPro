var rolRecargador = {

	run: function(creep) {

        if(creep.memory.transferir && creep.carry.energy == 0) { // Creep en Modo Transferir / Sin energía
            creep.memory.transferir = false; // Pasar a Modo Recolección para obtener más energía
            creep.say('transfiriendo energía');
        }
        if(!creep.memory.transferir && creep.carry.energy == creep.carryCapacity) { // Creep en Modo Recolección / Full energía
            creep.memory.transferir = true; // Pasar a Modo Transferir para llevar energía a un contenedor
            creep.say('building');
        }
        if(creep.memory.transferir) { // Creep en Modo Transferir / Con energía
			// Dejar de llevar energía al Controlador cuando alcance el level 2
			if(creep.room.controller.level < 2){
				// Entregará la energía al Controlador si está cerca de éste
				if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					// Si no es así, se desplazará primero hasta él
					creep.moveTo(creep.room.controller);
				}
			}
			else{
				
			}
        }
        else { // Modo Recolección 
            var sources = creep.room.find(FIND_SOURCES); // Localizar fuente y obtener energía
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) { // Desplazarse hasta la fuente si no está cerca
                creep.moveTo(sources[0]);
            }
		}
	}
};

module.exports = rolRecargador;
