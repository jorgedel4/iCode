package structs

// Struct for the student info
type SelectQuestion struct {
	Student   string
	Assigment string
	Group     string
}

type ResultQuestion struct {
	IdPregunta string
	Type       string
	Info       string
	Status     string //JSON with Info Question
}
