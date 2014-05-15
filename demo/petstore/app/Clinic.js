/**
 * 
 */
function Clinic() {
	this.owners = owners;
	this.vets = vets;
	this.pets = pets;
}

/**
 * Retrieve all <code>Owener</code>s from the data store
 * 
 * @return a <code>Collection</code> of <code>Owner</code>s
 */
Clinic.prototype.getOwners = function() {
	return this.owners;
}

/**
 * 
 */
Clinic.prototype.buildOwnerTreeModel = function() {
	var me = this;
	var children = new Array();
	angular.forEach(this.owners, function(owner) {
		children.push(me._buildOwnerNode(owner));
	});
	var root = this._buildTreeNode('ownerTreeRoot', 'Owners', children);
	return [ root ];
}

/**
 * @private
 */
Clinic.prototype._buildOwnerNode = function(owner) {
	var me = this;
	var text = owner.firstName + ' ' + owner.lastName;
	var children = new Array();
	angular.forEach(owner.pets, function(pet) {
		children.push(me._buildPetNode(pet));
	});
	return this._buildTreeNode(owner.id, text, children, 'owner');
}

/**
 * @private
 */
Clinic.prototype._buildPetNode = function(pet) {
	return this._buildTreeNode(pet.id, pet.name + ' (' + pet.type.name + ')',
			null, 'pet');
}

/**
 * @private
 */
Clinic.prototype._buildTreeNode = function(id, text, children, type) {
	return {
		id : id,
		text : text,
		children : children,
		type : type
	};
}

/**
 * Retrieve all <code>Vet</code>s from the data store.
 * 
 * @return a <code>Collection</code> of <code>Vet</code>s
 */
Clinic.prototype.getVets = function() {
	return this.vets;
};

/**
 * Retrieve all <code>PetType</code>s from the data store.
 * 
 * @return a <code>Collection</code> of <code>PetType</code>s
 * 
 */
Clinic.prototype.getPetTypes = function() {
	return types;
};

/**
 * Retrieve <code>Owner</code>s from the data store by last name,
 * 
 * returning all owners whose last name <i>starts</i> with the given name.
 * 
 * @param lastName
 *            Value to search for
 * 
 * @returns a <code>Collection</code> of matching <code>Owner</code>s (or
 *          an empty <code>Collection</code> if none found)
 * 
 */
Clinic.prototype.findOwners = function(lastName) {
	return this.owners;
};

/**
 * Retrieve an <code>Owner</code> from the data store by id.
 * 
 * @param id
 *            the id to search for
 * @return the <code>Owner</code> if found
 * 
 */

Clinic.prototype.loadOwner = function(id) {
	var owner = null;
	for ( var i = 0; i < owners.length; i++) {
		if (owners[i].id === id) {
			owner = owners[i];
			break;
		}
	}
	return owner;
};

/**
 * 
 * 
 * 
 * Retrieve a <code>Pet</code> from the data store by id.
 * 
 * @param id
 *            the id to search for
 * @returns the <code>Pet</code> if found
 */
Clinic.prototype.loadPet = function(id) {
	var pet = null;
	for ( var i = 0; i < pets.length; i++) {
		if (pets[i].id === id) {
			pet = pets[i];
			break;
		}
	}
	return pet;
};

/**
 * Save an <code>Owner</code> to the data store, either inserting or updating
 * it.
 * 
 * @param owner
 *            the <code>Owner</code> to save
 */

Clinic.prototype.storeOwner = function(owner) {
	var idx = this._indexOf(this.owners, 'id', owner['id']);
	if (idx != -1) {
		this.owners.splice(idx, 1, owner);
	} else {
		this.owners.push(idx);
	}
};

/**
 * Save a <code>Pet</code> to the data store, either inserting or updating it.
 * 
 * @param pet
 *            the <code>Pet</code> to save
 */

Clinic.prototype.storePet = function(pet) {
	var idx = this._indexOf(this.pets, 'id', pet['id']);
	if (idx != -1) {
		this.pets.splice(idx, 1, pet);
	} else {
		this.pets.push(idx);
	}
};

/**
 * 
 * Save a <code>Visit</code> to the data store, either inserting or updating
 * it.
 * 
 * @param visit
 *            the <code>Visit</code> to save
 */

Clinic.prototype.storeVisit = function(visit) {
	var idx = this._indexOf(visits, 'id', visit['id']);
	if (idx != -1) {
		array.splice(idx, 1);
	}
	this.visits.push(idx);
};

/**
 * Deletes a <code>Pet</code> from the data store.
 */

Clinic.prototype.deletePet = function(id) {

};

Clinic.prototype.rateVetUp = function(vetId) {
};

Clinic.prototype.rateVetDown = function(vetId) {

};

/**
 * 
 */
Clinic.prototype._indexOf = function(items, propertyName, value) {
	var index = -1;
	for ( var i = 0; i < items.length; i++) {
		if (items[i][propertyName] === value) {
			index = i;
			break;
		}
	}
	return index;
}
