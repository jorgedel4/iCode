package python

import (
	"fmt"

	"github.com/jorgedel4/iCode/structs"
)

func testLine(inputs [][]string, output []string, driverF string) (string, error) {
	expression := fmt.Sprintf("%s(", driverF)

	for i, input := range inputs {
		expression += input[1]
		if i != len(inputs)-1 {
			expression += ","
		}
	}
	expression += ")"

	line := fmt.Sprintf("\nprint(f\"PASSED\" if %s else f\"FAILED (Expected %s, got {%s})\")", expression+"== "+output[1], output[1], expression)

	return line, nil
}

func InjectTestsPython(code string, problem structs.CodingExercise) (string, error) {
	var resultCode = ""
	for i := 0; i < len(problem.Inputs); i++ {
		testLine, err := testLine(problem.Inputs[i], problem.Outputs[i], problem.DriverFunc)
		if err != nil {
			return "", nil
		}
		resultCode += testLine
	}
	return code + resultCode, nil
}
