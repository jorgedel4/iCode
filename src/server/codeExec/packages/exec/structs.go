package exec

type Problem struct {
	Inputs     [][]string `json:"inputs"`
	Outputs    []string `json:"outputs"`
	TimeOutSec int `json:"timeoutSec"`
	Language   string `json:"language"`
}

type RequestBody struct {
	ID   string `json:"id"`
	Code string `json:"code"`
}