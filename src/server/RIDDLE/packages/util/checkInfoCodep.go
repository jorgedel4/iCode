package util

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"encoding/json"
	"fmt"
	"net/http"
	"reflect"
	"strings"
)

// Funcion para definir el tipo de pregunta
func QType(w http.ResponseWriter, question structs.RequestQuestion) (string, error) {
	// Verificar si el string contiene "multi"
	if strings.Contains(strings.ToLower(question.Info), "multi") {
		return "multi", nil
	}

	// Verificar si el string contiene "codep"
	if strings.Contains(strings.ToLower(question.Info), "codep") {
		return "codep", nil
	}

	// Si no contiene ninguna de las palabras clave
	return "Tipo de pregunta no válido", nil
}

//---------------------------------------------------------------------

// Obtener "info" del string global
// Recibe el string de .info completo toma solo lo necesario y devuelve el string a insertar en la DB
func GetWithoutKeysCodep(input string) (string, error) {
	var info structs.InfoStructCodepWithoutKeys
	err := json.Unmarshal([]byte(input), &info)
	if err != nil {
		fmt.Println("Error al analizar el JSON:", err)
	}
	newInfo, err := json.Marshal(info)
	if err != nil {
		fmt.Println("Error al analizar el JSON:", err)
	}
	newInfoString := string(newInfo)
	return newInfoString, err
}

// ---------------------------------------------------------------------
// Obtener informacion y comprobacion de estructura de Info para CODEP
func GetInfoCodep(w http.ResponseWriter, input string, stmt *sql.Stmt) error {
	// Recibo el string de Info
	//input = "{\"module\": \"M0000000000000000001\", \"q_type\": \"codep\", hinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"sinputs\": [[\"4\", \"3\", \"1\", \"9\", \"2\"], [\"2\", \"0\", \"7\"]], \"houtputs\": [\"9\", \"7\"], \"language\": \"python\", \"soutputs\": [\"9\", \"7\"], \"timeoutSec\": 10, \"description\": \"create a sefunction that returns the biggest number\", \"initialCode\": \"\", \"forbiddenFunctions\": [\"sum\"], \"created_by\": \"L00000002\"}"

	//Call the GetInfoStructCodep function to get the structure with the data.
	info, _ := GetInfoStructCodep(input)

	//Create info string from all remaining initial info elements
	stringInfo, _ := GetWithoutKeysCodep(input)

	//Check all the keys per question
	err := CheckKeysInJSONCodep(input)
	if err != nil {
		fmt.Println(err)
		return err
	}

	//Insert data in DB
	InsertQueryCodep(w, stringInfo, info, stmt)

	return err
}

// Function to storage the values from initial json in a structure
func GetInfoStructCodep(input string) (structs.InfoStructCodep, error) {
	var info structs.InfoStructCodep
	err := json.Unmarshal([]byte(input), &info)
	if err != nil {
		return info, fmt.Errorf("error al analizar el JSON: %v", err)
	}

	value := reflect.ValueOf(info)
	typeInfo := reflect.TypeOf(info)

	for i := 0; i < value.NumField(); i++ {
		field := value.Field(i)
		fieldName := typeInfo.Field(i).Name

		//Check that all the keys have a value
		if fieldName != "InitialCode" && fieldName != "ForbiddenFunctions" {
			switch field.Kind() {
			case reflect.String:
				if field.String() == "" {
					return info, fmt.Errorf("la llave '%s' no tiene un valor asignado", fieldName)
				}
			case reflect.Slice:
				if field.Len() == 0 {
					return info, fmt.Errorf("la llave '%s' no tiene un valor asignado", fieldName)
				}
			case reflect.Int:
				if field.Int() == 0 {
					return info, fmt.Errorf("la llave '%s' no tiene un valor asignado", fieldName)
				}
			}
		}
	}
	return info, nil
}

// Function to check that all the keys exists in the initial json
func CheckKeysInJSONCodep(input string) error {
	// Deserializar JSON en un mapa
	var data map[string]interface{}
	err := json.Unmarshal([]byte(input), &data)
	if err != nil {
		return fmt.Errorf("error al deserializar el JSON: %v", err)
	}

	// Verificar si todas las llaves de InfoStructCodep están presentes en el mapa
	keys := make(map[string]bool)
	keys["module"] = true
	keys["q_type"] = true
	keys["description"] = true
	keys["hinputs"] = true
	keys["houtputs"] = true
	keys["sinputs"] = true
	keys["soutputs"] = true
	keys["timeoutSec"] = true
	keys["forbiddenFunctions"] = true
	keys["initialCode"] = true
	keys["language"] = true
	keys["created_by"] = true

	for key := range keys {
		if _, ok := data[key]; !ok {
			return fmt.Errorf("la llave '%s' no está presente en el JSON", key)
		}
	}
	return nil
}

// Casos de prueba y seguridad para codep

// (Completado) Revisar que vengan todas las llaves (puedo acceder a las llaves de la estructura y usar COntain para definir si el string de info global cuenta con todas las llaves)
// (Completado) Revisar que todas las llaves tengan valores, a excepcion de initialCode y forbiddenFunctions pues puede que no tengan valores
// () Que no puedan inyectar condigo malcioso en los espacios (en el strig de info global revisr que no exista codigo malicioso)
