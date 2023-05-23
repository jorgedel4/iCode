package read

import (
	"database/sql"
	"elPadrino/RIDDLE/packages/structs"
	"encoding/json"
	"net/http"
)

// Get the progress for a homework
func StatusHomework(mysqlDB *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Enable CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// Get the required variables from URL parameters
		var req structs.HomeworkCheck
		req.StudentID = r.URL.Query().Get("student_id")
		req.HomeworkID = r.URL.Query().Get("homework_id")

		// Check if the required variables are provided
		if req.StudentID == "" || req.HomeworkID == "" {
			http.Error(w, "Error reading parameters from URL", http.StatusBadRequest)
			return
		}

		query := `SELECT GetTotalQuestions(?, ?), GetCorrectQuestion(?, ?);`

		var progress int
		var total int
		err := mysqlDB.QueryRow(query, req.StudentID, req.HomeworkID, req.StudentID, req.HomeworkID).Scan(&total, &progress)
		if err != nil {
			http.Error(w, "Error executing query", http.StatusInternalServerError)
			return
		}

		// Create a response struct
		response := struct {
			Total    int `json:"total"`
			Progress int `json:"progress"`
		}{
			Total:    total,
			Progress: progress,
		}

		// Encode the response struct into JSON
		responseJSON, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Error parsing response", http.StatusInternalServerError)
			return
		}

		// Set the response headers and write the response JSON
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(responseJSON)
	}
}

/*
Pseudocodigo para obtener el status actual de una tarea en cuanto a progreso

GO
- Necesito pedir como parametros con GET el id_student, id_homework
- En base a esto debo verificar el progreso de este estduiante en esa tarea

MYSQL
Puedo crear una funcion que reciba los dos id como parametros,

La funcion debe:

- Crear un contador que tome la cantidad de intentos pasados (status = PAS)de ese estudiante en esa tarea desde
la tabla de hw_questionAttempts

- Para saber cuantas preguntas tenia esa pregunta debo ir a homeworkConfigs y revisar todos los registros con ese id_homework,
puedo hacer un select de todos los registros con ese id de tarea, una vez que ya tengo todos los registros, con un
cursor recorro cada registro y tomo el numero de preguntas n_questions, ya con eso sumo todos para tener un total que
equivale a mi 100% de la tarea,

Al final solo necesito calcular el porcentaje, lo puedo hacer desde mysql para que la funcion central de me un entero
que representa el porcentaje



NOTAS:

No debo fijarme en las preguntas que ya tengan 3 intentos con FAI, porque siguen contando como fallas
y el procentaje de avance solo toma en consideracion a las preguntas bien contestadas

*/
