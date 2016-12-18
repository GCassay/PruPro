var rolRecargadorMid = {

	run: function(creep) {

        if(creep.memory.transferir && creep.carry.energy == 0) { // Creep en Modo Transferir / Sin energía
            creep.memory.transferir = false; // Pasar a Modo Recolección para obtener más energía
            //creep.say('Recolectar');
        }
        if(!creep.memory.transferir && creep.carry.energy == creep.carryCapacity) { // Creep en Modo Recolección / Full energía
            creep.memory.transferir = true; // Pasar a Modo Transferir para llevar energía a un contenedor
            //creep.say('Transferir');
        }
        if(creep.memory.transferir) { // Creep en Modo Transferir / Con energía

            // Localizar Contenedor
            var punto = Game.rooms.sim.getPositionAt(34,23);
            var contenedor = punto.findClosestByRange(FIND_STRUCTURES);
            if(contenedor){
                if(creep.transfer(contenedor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(contenedor);
                }
            }
        }
        else { // Modo Recolección 
            var punto = Game.rooms.sim.getPositionAt(35,20);
            var fuente = punto.findClosestByRange(FIND_SOURCES_ACTIVE);
            // Si no está en el rango de la fuente, desplazarse hasta ella
            if(creep.harvest(fuente) == ERR_NOT_IN_RANGE) {
                creep.moveTo(fuente);
            }   
		}
	}
};

module.exports = rolRecargadorMid;
