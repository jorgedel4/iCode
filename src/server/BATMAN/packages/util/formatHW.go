package util

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/jorgedel4/iCode/packages/structs"
)

func FormatHomework(results []interface{}, accountType string, groupBy string) ([]byte, error) {
	if groupBy == "group" {
		result := make(map[string][]interface{})

		for _, hw := range results {
			if accountType == "professor" {
				result[hw.(structs.HWProfessor).GroupID] =
					append(result[hw.(structs.HWProfessor).GroupID], hw)
			} else if accountType == "student" {
				result[hw.(structs.HWStudent).GroupID] =
					append(result[hw.(structs.HWStudent).GroupID], hw)
			}
		}
		
		return json.Marshal(result)

	} else if groupBy == "week" {
		result := make([][]interface{}, 7)
		for i := 0; i < 7; i++ {
			result[i] = make([]interface{}, 0)
		}
		now := time.Now().Truncate(24 * time.Hour)

		if accountType == "professor" {
			for _, hw := range results {
				day := hw.(structs.HWProfessor).Closing.Truncate(24 * time.Hour)
				daysFromNow := int(day.Sub(now).Hours() / 24)
		
				if daysFromNow >= 0 && daysFromNow < 7 {
					result[daysFromNow] = append(result[daysFromNow], hw)
				}
			}
		}

		if accountType == "student" {
			for _, hw := range results {
				day := hw.(structs.HWStudent).Closing.Truncate(24 * time.Hour)
				daysFromNow := int(day.Sub(now).Hours() / 24)
		
				if daysFromNow >= 0 && daysFromNow < 7 {
					result[daysFromNow] = append(result[daysFromNow], hw)
				}
			}
		}

		return json.Marshal(result)
	}
	return []byte{}, fmt.Errorf("group by '%s' not supported", groupBy)
}
