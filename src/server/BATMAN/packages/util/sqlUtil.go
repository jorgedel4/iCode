package util

import (
	"database/sql"
	"fmt"
)

// Function that checks if a given key exists
func KeyExists(db *sql.DB, tableName string, keyName interface{}, keyValue interface{}) (bool, error) {
	query := fmt.Sprintf("SELECT COUNT(*) FROM %s WHERE %v = '%v'", tableName, keyName, keyValue)
	var count int
	err := db.QueryRow(query, keyValue).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}