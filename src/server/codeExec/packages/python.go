package packages

import (
	"strings"
)

// TODO
// (For python only)
// Function to purge code
// Function to inject test cases
// Function to run code (posibly in docker container)
// Function to parse result
// Check result for response status code
// Return info to client
// Move code into packages
// Test functions

func cleanPython(pythonCode string, notAllowedFuncs []string) string {
	lines := strings.Split(pythonCode, "\n")
	var filteredLines []string
	for _, line := range lines {
		isDisallowed := false
		for _, funcName := range notAllowedFuncs {
			if strings.Contains(line, funcName) {
				isDisallowed = true
				break
			}
		}
		if !isDisallowed {
			filteredLines = append(filteredLines, line)
		}
	}
	return strings.Join(filteredLines, "\n")
}

// TODO
// Implement functionality
// Pipeline:
// 1. Clean code
// 2. Inject tests to code
// 3. Run code in container
// 4. Parse execution result

func runPython(problem CodingExercise, reqBody RequestBody) (CodeResult, error) {
	// Cleaning code
	reqBody.Code = cleanPython(reqBody.Code, problem.NotAllowedFuncs)

	var cr CodeResult
	return cr, nil

}
