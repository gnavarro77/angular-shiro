var radiology = new Speciality(1, 'radiology');
var surgery = new Speciality(2, 'surgery');
var dentistry = new Speciality(3, 'dentistry');

var specialities = [ radiology, surgery, dentistry ];

var vet1 = new Vet(1, 'James', 'Carter');
var vet2 = new Vet(2, 'Helen', 'Leary', radiology);
var vet3 = new Vet(3, 'Linda', 'Douglas', surgery);
var vet4 = new Vet(4, 'Rafael', 'Ortega', dentistry);
var vet5 = new Vet(5, 'Henry', 'Stevens', surgery);
var vet6 = new Vet(6, 'Sharon', 'Jenkins', radiology);

var vets = [ vet1, vet2, vet3, vet4, vet5, vet6 ];

var cat = new PetType(1, 'cat');
var dog = new PetType(2, 'dog');
var lizard = new PetType(3, 'lizard');
var snake = new PetType(4, 'snake');
var bird = new PetType(5, 'bird');
var hamster = new PetType(6, 'hamster');
var types = [ cat, dog, lizard, snake, bird, hamster ];

var pet1 = new Pet(1, 'Leo', '2000-09-07', cat, owner1);
var pet2 = new Pet(2, 'Basil', '2002-08-06', hamster, owner2);
var pet3 = new Pet(3, 'Rosy', '2001-04-17', dog, owner3);
var pet4 = new Pet(4, 'Jewel', '2000-03-07', dog, owner3);
var pet5 = new Pet(5, 'Iggy', '2000-11-30', lizard, owner4);
var pet6 = new Pet(6, 'George', '2000-01-20', snake, owner5);
var pet7 = new Pet(7, 'Samantha', '1995-09-04', cat, owner6);
var pet8 = new Pet(8, 'Max', '1995-09-04', cat, owner6);
var pet9 = new Pet(9, 'Lucky', '1999-08-06', bird, owner7);
var pet10 = new Pet(10, 'Mulligan', '1997-02-24', dog, owner8);
var pet11 = new Pet(11, 'Freddy', '2000-03-09', bird, owner9);
var pet12 = new Pet(12, 'Lucky', '2000-06-24', dog, owner10);
var pet13 = new Pet(13, 'Sly', '2002-06-08', cat, owner10);

var pets = [ pet1, pet2, pet3, pet4, pet5, pet6, pet7, pet8, pet9, pet10,
		pet11, pet12, pet13 ];

var owner1 = new Owner(1, 'Keith', 'Donald', '110 W. Liberty St.', 'Madison',
		'6085551023', [ pet1 ]);
var owner2 = new Owner(2, 'Keri', 'Donald', '638 Cardinal Ave.', 'Sun Prairie',
		'6085551749', [ pet2 ]);
var owner3 = new Owner(3, 'Ronald', 'McDonald', '2693 Commerce St.',
		'McFarland', '6085558763', [ pet3, pet4 ]);
var owner4 = new Owner(4, 'Harold', 'Davis', '563 Friendly St.', 'Windsor',
		'6085553198', [ pet5 ]);
var owner5 = new Owner(5, 'Peter', 'McTavish', '2387 S. Fair Way', 'Madison',
		'6085552765', [ pet6 ]);
var owner6 = new Owner(6, 'Jean', 'Coleman', '105 N. Lake St.', 'Monona',
		'6085552654', [ pet7, pet8 ]);
var owner7 = new Owner(7, 'Peter', 'Black', '1450 Oak Blvd.', 'Monona',
		'6085555387', [ pet9 ]);
var owner8 = new Owner(8, 'Scott', 'Escobito', '345 Maple St.', 'Madison',
		'6085557683', [ pet10 ]);
var owner9 = new Owner(9, 'David', 'Schroeder', '2749 Blackhawk Trail',
		'Madison', '6085559435', [ pet11 ]);
var owner10 = new Owner(10, 'Carlos', 'Estaban', '2335 Independence La.',
		'Waunakee', '6085555487', [ pet12, pet13 ]);

var owners = [ owner1, owner2, owner3, owner4, owner5, owner6, owner7, owner8,
		owner9, owner10 ];

var visit = new Visit(1, 7, '1996-03-04', 'rabies shot');
var visit = new Visit(2, 8, '1996-03-04', 'rabies shot');
var visit = new Visit(3, 8, '1996-06-04', 'neutered');
var visit = new Visit(4, 7, '1996-09-04', 'spayed');

OWNER_MANAGER = {
	name : 'OWNER_MANAGER_ROLE',
	permissions : [ 'owner:*' ]
};
OWNER_MANAGER_GUEST = {
	name : 'OWNER_MANAGER_GUEST',
	permissions : [ 'owner:view' ]
};
VET_MANAGER = {
	name : 'VET_MANAGER',
	permissions : [ 'vet:*' ]
}
VET_MANAGER_GUEST = {
	name : 'VET_MANAGER_GUEST',
	permissions : [ 'vet:view' ]
};
PET_MANAGER = {
	name : 'PET_MANAGER',
	permissions : [ 'pet:*' ]
};
PET_MANAGER_GUEST = {
	name : 'PET_MANAGER',
	permissions : [ 'pet:view' ]
};
ADMIN = {
	name : "ADMIN",
	description : "Users with 'ADMIN' role can access all and every functionalities of the application",
	permissions : [ 'owner:*', 'vet:*', 'pet:*' ]
};
GUEST = {
	name : "GUEST",
	description : "Users with 'GUEST' role can only access read-only functionalities of the application",
	permissions : [ '*:view' ]
};

var roles = [ ADMIN, GUEST ];