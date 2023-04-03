package packages

import (
	"fmt"
)

// TODO
// (For python only)
// Function to inject test cases
// Function to run code (posibly in docker container)
// Function to parse result
// Check result for response status code
// Return info to client
// Move code into packages
// Test functions

func generateTesLine(inputs [][]string, output []string, driverF string) string{
	expression := fmt.Sprintf("\n%s(", driverF)

	for i, input := range inputs {
		expression += input[1]
		if i != len(inputs) - 1 {
			expression += ","
		}
	}
	expression += ") == " + output[1] 

	return expression
}

func injectTestsPython(problem *CodingExercise, code *string) error {
	nTests :=  len(problem.Inputs)

	for i := 0; i < nTests; i++ {
		*code += generateTesLine(problem.Inputs[i], problem.Outputs[i], problem.DriverFunc)
	}

	fmt.Println(*code)

	return nil
}

func runPython(problem *CodingExercise, code *string) (CodeResult, error) {
	var cr CodeResult

	// TODO
	// Properly handle error here
	err := injectTestsPython(problem, code)
	if err != nil {
		return cr, nil
	}

	return cr, nil
}
