package packages

import (
	"testing"
)

// Utility function to check if 2 slices are equal
func equalSlices(a, b []string) bool {
    if len(a) != len(b) {
        return false
    }
    for i, v := range a {
        if v != b[i] {
            return false
        }
    }
    return true
}

func TestDisallowedFs1(t *testing.T) {
	arg1 := "print('hello world')\nexec(x=4)\nprint('it works :)')"
	arg2 := []string{"exec"}
	output := []string{"exec"}

	result := disallowedFuncs(arg1, arg2)

	if !equalSlices(output, result) {
		t.Errorf("FAILED")
	} else {
		t.Logf("PASSED")
	}
}

func TestDisallowedFs2(t *testing.T) {
	arg1 := "def sumOfTwo(a, b):\n\treturn sum(a, b)\n\tprint('PASSED')"
	arg2 := []string{"sum", "print"}
	output := []string{"sum", "print"}

	result := disallowedFuncs(arg1, arg2)

	if !equalSlices(output, result) {
		t.Errorf("FAILED")
	} else {
		t.Logf("PASSED")
	}
}

func TestDisallowedFs3(t *testing.T) {
	arg1 := "def sumOfTwo(a, b):\n\treturn a + b"
	arg2 := []string{}
	output := []string{}

	result := disallowedFuncs(arg1, arg2)

	if !equalSlices(output, result) {
		t.Errorf("FAILED")
	} else {
		t.Logf("PASSED")
	}
}

func TestDisallowedFs4(t *testing.T) {
	arg1 := "def sumOfTwo(a, b):\n\tres = sum(a, b)\n\texec(a=23)\n\tprint('PASSED')\n\texec(c=8)"
	arg2 := []string{"sum", "input", "exec"}
	output := []string{"sum", "exec"}

	result := disallowedFuncs(arg1, arg2)

	if !equalSlices(output, result) {
		t.Errorf("FAILED")
	} else {
		t.Logf("PASSED")
	}
}