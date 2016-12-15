var rolRecargador = {

	run: function(minion) {
	
		// Dejar de llevar energía al Controlador cuando alcance el level 2
		if(minion.room.controller.level < 2){

			if(minion.carry.energy == 0) { // Si el creep NO lleva carga
				var recursos = minion.room.find(FIND_SOURCES);
				// Se recargará con energía de la fuente si está cerca de ésta
				if(minion.harvest(recursos[0]) == ERR_NOT_IN_RANGE) {
					// Si no es así,  se desplazará primero hasta ella
					minion.moveTo(recursos[0]);
				}
			}
			else { // Si el creep lleva carga
				// Entregará la energía al Controlador si está cerca de éste
				if(minion.upgradeController(minion.room.controller) == ERR_NOT_IN_RANGE) {
					// Si no es así, se desplazará primero hasta él
					minion.moveTo(minion.room.controller);
				}
			}
		}
		else{ // Si el Controlador es level 2, recargar el Contenedor
					
		}
	}
};

module.exports = rolRecargador;
