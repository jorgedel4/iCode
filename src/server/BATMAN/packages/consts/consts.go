package consts


var AccountTypes = map[byte]string{
    'L': "professor",
	'A': "student",
	'S': "admin",
}

var DBUsersIDColumn = map[string]string{
	"professor": "nomina",
	"student": "matricula",
	"admin": "id_admin",
}