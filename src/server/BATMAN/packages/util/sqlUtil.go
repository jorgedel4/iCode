package util

import (
	"database/sql"
	"fmt"
	"reflect"
	"strings"
)

func InsertRow(db *sql.DB, tableName string, data interface{}) error {
	// Get the reflect.Type and reflect.Value of the data argument.
	dataType := reflect.TypeOf(data)
	dataValue := reflect.ValueOf(data)

	// Build the SQL statement for inserting a row.
	var values []interface{}
	for i := 0; i < dataType.NumField(); i++ {
		field := dataType.Field(i)
		if field.Tag.Get("db") == "-" {
			continue // skip fields marked with db:"-"
		}
		values = append(values, dataValue.Field(i).Interface())
	}
	sqlStatement := fmt.Sprintf("INSERT INTO %s VALUES (%s)", tableName, strings.TrimRight(strings.Repeat("?,", len(values)), ","))

	// Execute the SQL statement.
	_, err := db.Exec(sqlStatement, values...)
	if err != nil {
		return err
	}

	return nil
}
