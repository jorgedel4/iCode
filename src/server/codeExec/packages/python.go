package packages

import (
	"bytes"
	"fmt"
	"os/exec"
)

// TODO
// (For python only)
// Function to parse result
// Check result for response status code
// Return info to client
// Move code into packages
// Test functions
// Timeout for code

func runPythonInDocker(pythonCode string) (string, error) {
	// Define the Docker command to run
	cmd := exec.Command("docker", "run", "--rm", "-i", "python:latest", "python", "-c", pythonCode)

	// Create a buffer to store the output
	var output bytes.Buffer

	// Redirect both stdout and stderr to the buffer
	cmd.Stdout = &output
	cmd.Stderr = &output

	// Run the command and wait for it to complete
	cmd.Run()

	// Return the output as a string
	return output.String(), nil
}

func generateTesLine(inputs [][]string, output []string, driverF string) string {
	expression := fmt.Sprintf("%s(", driverF)

	for i, input := range inputs {
		expression += input[1]
		if i != len(inputs)-1 {
			expression += ","
		}
	}
	expression += ")"

	// TODO UNIMPORTANT
	// Mofidy string to just run function once
	line := fmt.Sprintf("\nprint(f\"PASSED\" if %s else f\"FAILED (Expected %s, got {%s})\")", expression+"== "+output[1], output[1], expression)

	return line
}

func injectTestsPython(problem *CodingExercise, code *string) {
	for i := 0; i < len(problem.Inputs); i++ {
		*code += generateTesLine(problem.Inputs[i], problem.Outputs[i], problem.DriverFunc)
	}
}

func runPython(problem *CodingExercise, code *string) (CodeResult, error) {
	var cr CodeResult

	injectTestsPython(problem, code)

	result, err := runPythonInDocker(*code)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println(result)
	}

	return cr, nil
}
