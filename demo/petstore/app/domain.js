/**
 * Class representing a veterinarian
 */
function Vet(id, firstName, lastName, speciality) {
	this.id = id;
	this.firstName = firstName;
	this.lastName = lastName;
	this.speciality;
}

/**
 * Class representing a veterinary specialty
 */
function Speciality(id, name) {
	this.id = id;
	this.name = name;
}

/**
 * Class representing an animal's owner
 */
function Owner(id, firstName, lastName, address, city, telephone, pets) {
	this.id = id;
	this.firstName = firstName;
	this.lastName = lastName;
	this.address = address;
	this.city = city;
	this.telephone = telephone;
	this.pets = pets;
}

/**
 * Class representing a Pet
 */
function Pet(id, name, birthDate, type, owner) {
	this.id = id;
	this.name = name;
	this.birthDate = birthDate;
	this.type = type;
	this.owner = owner;
}

/**
 * Class representing a pet's type
 */
function PetType(id, name) {
	this.id = id;
	this.name = name;
}

/**
 * 
 * Class representing a veterinary consultation
 */
function Visit() {
	this.id;
	this.pet;
	this.visitDate;
	this.description;
}
/**
 * Class representing a user of the application
 */
function User(username, password, enabled) {
	this.username = username;
	this.password = password;
	this.enabled = enabled;
}

/**
 * Class representing a user's authority
 */
function Authority(username, authority) {
	this.username = username;
	this.authority = authority;
}
