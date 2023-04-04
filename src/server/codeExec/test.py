import unittest
  
def sumOfTwo(a,b):
    return a + b

# Test 1
print("PASSED" if sumOfTwo(1,3) == 4 else "FAILED", "expected")

{driverFunction}({inputs[0][0][1], inputs[0][1][1]}) == outputs[0][1]
{driverFunction}({inputs[1][0][1], inputs[1][1][1]}) == outputs[1][1]

{
    "error": "",
    "shownTests": [
        {
            "passed": True,
            "input": "2, 3",
            "expected": "4",
            "got": "4"
        },
        {
            "passed": True,
            "input": "2, 3",
            "expected": "4",
            "got": "4"
        },
        {
            "passed": True,
            "input": "2, 3",
            "expected": "4",
            "got": "4"
        }
    ],
    "hiddenTests": {
        "passed": 4,
        "failed": 2,
    }
}