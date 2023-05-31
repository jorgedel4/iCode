package util

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"encoding/json"
	"fmt"
	"net/http"
)

// Recibe el string de .info completo toma solo lo necesario y devuelve el string a insertar en la DB
func GetWithoutKeysMulti(input string) (string, error) {
	var info structs.InfoStructMultiWithoutKeys
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

//_____________________________________________________________

func GetInfoMulti(w http.ResponseWriter, input string, stmt *sql.Stmt) error {

	//Llamo a la función GetInfoStructCodep para obtener la estructura con los datos
	info, _ := GetInfoStructMulti(input)

	//Crear el string de info a partir de todos los elementos restantes de info inicial
	stringInfo, _ := GetWithoutKeysMulti(input)

	//Check all the keys per question
	err := CheckKeysInJSONMulti(input)
	if err != nil {
		fmt.Println(err)
		return err
	}

	fmt.Println("Todas las llaves están presentes en el JSON")

	InsertQueryMulti(w, stringInfo, info, stmt)
	return err
}

// Función para almacenar los valores del string en una estructura
func GetInfoStructMulti(input string) (structs.InfoStructMulti, error) {
	var info structs.InfoStructMulti
	err := json.Unmarshal([]byte(input), &info)
	if err != nil {
		fmt.Println("Error al analizar el JSON:", err)
	}
	return info, err
}

// FUnction to check that all the keys exists
func CheckKeysInJSONMulti(input string) error {
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
	keys["question"] = true
	keys["n_options"] = true
	keys["options"] = true
	keys["correct_option"] = true
	keys["explanation"] = true
	keys["created_by"] = true

	for key := range keys {
		if _, ok := data[key]; !ok {
			return fmt.Errorf("la llave '%s' no está presente en el JSON", key)
		}
	}

	return nil
}

// Casos de prueba y seguridad para multi

// Revisar que vengan todas las llaves
// Revisar que todas las llaves tengan valores
// Que no puedan inyectar condigo malcioso en los espacios
// Comprobar que n_options coincida con la cantidad de elementos en el arreglo de options
// revisar que correct_option exista en options
