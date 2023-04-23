package exec

import (
	"fmt"
	"strings"
)

// Utility function to check if a slice contains a value
func contains(sl []string, s string) bool {
	for _, v := range sl {
		if v == s {
			return true
		}
	}
	return false
}

// Function that takes code and a slice of disallowed functions
// Returns a slice of strings containing all the disallowed functions that were found (non-repeating, first found first added to the slice)
func disallowedFuncs(pythonCode string, notAllowedFuncs []string) []string {
	disallowedFuncsFound := []string{}
	for _, function := range notAllowedFuncs {
		if strings.Contains(pythonCode, fmt.Sprintf(" %s(", function)) {
			if !contains(disallowedFuncsFound, function) {
				disallowedFuncsFound = append(disallowedFuncsFound, function)
			}
		}
	}
	return disallowedFuncsFound
}

// Function that takes the output from running code into a Result struct
// func parseIntoResult(result *structs.Result, output string) error {
// 	if output[0] != '+' && output[0] != '-' {
// 		result.Error = output
// 		return nil
// 	}

// 	result.Error = ""
// 	lines := strings.Split(output, "\n")
// 	lines = lines[:len(lines)-1]
// 	shownTests := make(map[string]int)
// 	result.HiddenTests = shownTests
// 	hiddenTests := make(map[string]int)
// 	hiddenTests["failed"] = 0
// 	hiddenTests["passed"] = 0
// 	result.HiddenTests = hiddenTests
// 	for _, line := range lines {
// 		parsedLine := strings.Split(line, "|")
// 		visibility := parsedLine[0]
// 		status := parsedLine[1]

// 		if visibility == "+" {
// 			m := make(map[string]string)
// 			m["status"] = status
// 			m["input"] = parsedLine[2]
// 			m["expected"] = parsedLine[3]
// 			m["got"] = parsedLine[4]
// 			result.ShownTests = append(result.ShownTests, m)
// 		} else if visibility == "-" {
// 			result.HiddenTests[status]++
// 		}
// 	}
// 	return nil
// }
