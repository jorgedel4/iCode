package util

import (
	"errors"

	"github.com/jorgedel4/iCode/python"
	"github.com/jorgedel4/iCode/structs"
)

// "switch" functions that determine which function will be called
// according to the language

// Switch function to inject tests, returns code with tests as a single string
func injectTests(code string, problem structs.CodingExercise) (string, error) {
	switch problem.Language {
	case "Python":
		return python.InjectTestsPython(code, problem)
	}
	return "", errors.New("Language not supported")
}
