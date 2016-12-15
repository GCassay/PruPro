var rolRecargador = {

	run: function(creep) {
	
		// Dejar de llevar energía al Controlador cuando alcance el level 2
		if(creep.room.controller.level < 2){

			if(creep.carry.energy == 0) { // Si el creep NO lleva carga
				var recursos = creep.room.find(FIND_SOURCES);
				// Se recargará con energía de la fuente si está cerca de ésta
				if(creep.harvest(recursos[0]) == ERR_NOT_IN_RANGE) {
					// Si no es así,  se desplazará primero hasta ella
					creep.moveTo(recursos[0]);
				}
			}
			else { // Si el creep lleva carga
				// Entregará la energía al Controlador si está cerca de éste
				if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					// Si no es así, se desplazará primero hasta él
					creep.moveTo(creep.room.controller);
				}
			}
		}
		else{ // Si el Controlador es level 2, recargar el Contenedor
					
		}
	}
};

module.exports = rolRecargador;
