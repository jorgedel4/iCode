package packages

import "testing"

func TestCleanPython1(t *testing.T) {
	arg1 := "print('hello world')\nexec(x=4)\nprint('it works :)')"
	arg2 := []string{"exec"}
	output1 := "print('hello world')\nprint('it works :)')"

	result := cleanPython(arg1, arg2)

	if result != output1 {
		t.Errorf("FAILED")
	} else {
		t.Logf("PASSED")
	}
}

func TestCleanPython2(t *testing.T) {
	arg1 := "def sumOfTwo(a, b):\n\treturn sum()"
	arg2 := []string{"exec"}
	output1 := "print('hello world')\nprint('it works :)')"

	result := cleanPython(arg1, arg2)

	if result != output1 {
		t.Errorf("FAILED")
	} else {
		t.Logf("PASSED")
	}
}

func TestCleanPython3(t *testing.T) {
	arg1 := "print('hello world')\nexec(x=4)\nprint('it works :)')"
	arg2 := []string{"exec"}
	output1 := "print('hello world')\nprint('it works :)')"

	result := cleanPython(arg1, arg2)

	if result != output1 {
		t.Errorf("FAILED")
	} else {
		t.Logf("PASSED")
	}
}

func TestCleanPython4(t *testing.T) {
	arg1 := "print('hello world')\nexec(x=4)\nprint('it works :)')"
	arg2 := []string{"exec"}
	output1 := "print('hello world')\nprint('it works :)')"

	result := cleanPython(arg1, arg2)

	if result != output1 {
		t.Errorf("FAILED")
	} else {
		t.Logf("PASSED")
	}
}

func TestCleanPython5(t *testing.T) {
	arg1 := "print('hello world')\nexec(x=4)\nprint('it works :)')"
	arg2 := []string{"exec"}
	output1 := "print('hello world')\nprint('it works :)')"

	result := cleanPython(arg1, arg2)

	if result != output1 {
		t.Errorf("FAILED")
	} else {
		t.Logf("PASSED")
	}
}