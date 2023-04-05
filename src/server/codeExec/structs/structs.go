package structs

type CodingExercise struct {
	ID 					string 		`json:"id" bson:"id"`
	Description 		string 		`json:"description" bson:"description"`
	Language 			string 		`json:"language" bson:"language"`
	TimeOut 			int 		`json:"timeOut" bson:"timeOut"`
	DriverFunction 		string 		`json:"driverFunction" bson:"driverFunction"`
	ForbiddenFunctions 	[]string 	`json:"forbiddenFunctions" bson:"forbiddenFunctions"`
	Tests 				[]Test 		`json:"tests" bson:"tests"`
}

type Test struct {
	Hidden bool 		`json:"hidden" bson:"hidden"`
	Inputs [][]string 	`json:"inputs" bson:"inputs"`
	Output []string 	`json:"output" bson:"output"`
}

type RequestBody struct {
	ID   string `json:"id"`
	Code string `json:"code"`
}

type CodeResult struct {
	Error string
	ShownTests []map[string]string
	HiddenTests map[string]int
}