package util

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
