package structs

type SelectQuestion struct {
	Student   string
	Assigment string
	Group     string
}

type ResultQuestion struct {
	IdPregunta string `json:"id_pregunta"`
	Type       string `json:"type"`
	Info       string `json:"info"`
}

type RequestQuestion struct {
	/* IdQuestion  = con la idgenerator lo agrego*/
	Module    string `json:"module"`
	QType     string `json:"q_type"`
	Info      string `json:"info"`
	CreatedBy string `json:"created_by"`
	/* SubmittedOn agrego el tiempo en el que se agrega realmente */
	/* CurrentStatus = a todos se les da PEN por default */
}

type ModQuestAttempt struct {
	Student       string `json:"student"`
	Group         string `json:"grupo"`
	IdQuestion    string `json:"question"`
	AttemptStatus string `json:"attempt_status"`
}
