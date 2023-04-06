package util

import (
	"bytes"
	"os/exec"
)

func execute(code string, language string) (string, error) {
	// Define the Docker command to run
	var cmd *exec.Cmd
	if language == "Python" {
		cmd = exec.Command("docker", "run", "--rm", "-i", "python:latest", "python", "-c", code)
	}

	// Create a buffer to store the output
	var output bytes.Buffer

	// Redirect both stdout and stderr to the buffer
	cmd.Stdout = &output
	cmd.Stderr = &output

	// Run the command and wait for it to complete
	cmd.Run()

	// Return the output as a string
	return output.String(), nil
}
