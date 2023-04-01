package packages

type CodingEx struct {
	ID          	string `json:"id"`
	Description 	string `json:"description"`
	Language    	string `json:"language"`
	Inputs      	[][][]string `json:"inputs"`
	Outputs     	[][][]string `json:"outputs"`
	DriverFunc		string `json:"driverFunc"`
	NotAllowedFuncs	[]string `json:"notAllowedFuncs"`
}
