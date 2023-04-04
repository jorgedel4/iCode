package packages

import (
	"bytes"
	"fmt"
	"os/exec"
	"strings"
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
	err := cmd.Run()

	// Return the output as a string
	return output.String(), err
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
	line := fmt.Sprintf("\nprint(f\"PASSED\" if %s else f\"FAILED\", f\"(Expected %s, got {%s})\")", expression+"== "+output[1], output[1], expression)

	return line
}

func injectTestsPython(problem *CodingExercise, code *string) {
	for i := 0; i < len(problem.Inputs); i++ {
		*code += generateTesLine(problem.Inputs[i], problem.Outputs[i], problem.DriverFunc)
	}
}

func parseOutput(out string, codeResult *CodeResult, err error) error {
	if err != nil {
		codeResult.Error = out
		fmt.Println(out)
		return nil
	}

	lines := strings.Split(out, "\n")
	lines = lines[:len(lines) - 1]

	for _, line := range lines {
		test := make(map[string] string)
		if line[:6] == "PASSED" {
			test["status"] = "passed"
		}
		if line[:6] == "FAILED" {
			test["status"] = "failed"
		}
		
	}
	return nil
}

func runPython(problem *CodingExercise, code *string) (CodeResult, error) {
	var cr CodeResult

	injectTestsPython(problem, code)

	result, err := runPythonInDocker(*code)

	parseOutput(result, &cr, err)

	return cr, nil
}
