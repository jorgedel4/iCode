package util

import (
	"math"
	"math/rand"
	"strconv"
	"time"
)

func GenerateID(prefix string, n int) string {
	rand.Seed(time.Now().UnixNano())

	max := int(math.Pow10(n))

	randNum := rand.Intn(max)

	randNumStr := strconv.Itoa(randNum)
	for len(randNumStr) < n {
		randNumStr = "0" + randNumStr
	}

	return prefix + randNumStr
}
