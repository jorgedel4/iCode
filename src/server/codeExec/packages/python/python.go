package python

import (
	"fmt"

	"github.com/jorgedel4/iCode/packages/structs"
)

func testLine(test structs.Test, driverFunction string) (string, error) {
	inputStr := ""
	var line, outputStr, visibility string
	for i, input := range test.Inputs {
		inputStr += input[1]
		if i != len(test.Inputs) - 1 {
			inputStr += ","
		}
	}
	outputStr = test.Output[1]
	functionCall := fmt.Sprintf("%s(%s)", driverFunction, inputStr)

	if test.Hidden {
		visibility = "-"
	} else {
		visibility += "+"
	}

	resultVar := fmt.Sprintf("result = %s", functionCall)
	printStatement := fmt.Sprintf("print(\"%s|passed\" if result == %s else f\"%s|failed|%s|%s|{result}\")", visibility, outputStr, visibility, inputStr, outputStr)

	line = fmt.Sprintf("\n%s\n%s", resultVar, printStatement)
	return line, nil
}

func InjectTestsPython(code string, problem structs.CodingExercise) (string, error) {
	var resultCode = ""
	
	for _, test := range problem.Tests {
		test, err := testLine(test, problem.DriverFunction)
		if err != nil {
			return "", err
		}
		resultCode += test
	}

	return code + resultCode, nil
}
