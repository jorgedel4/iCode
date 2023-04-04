package structs

type CodingExercise struct {
	ID              string       `json:"id" bson:"id"`
	Description     string       `json:"description" bson:"description"`
	Language        string       `json:"language" bson:"language"`
	Inputs          [][][]string `json:"inputs" bson:"inputs"`
	Outputs         [][]string   `json:"outputs" bson:"outputs"`
	DriverFunc      string       `json:"driverFunction" bson:"driverFunction"`
	NotAllowedFuncs []string     `json:"notAllowedFunctions" bson:"notAllowedFunctions"`
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