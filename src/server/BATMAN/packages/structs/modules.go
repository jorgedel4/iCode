package structs

import "time"

type Module struct {
	ID         string    `json:"id"`
	Name       string    `json:"name"`
	Status     string    `json:"status"`
	OpenDate   time.Time `json:"open_date"`
	CloseDate  time.Time `json:"close_date"`
	NQuestions int       `json:"n_questions"`
}

type ModuleStudent struct {
	ID         string    `json:"id"`
	Name       string    `json:"name"`
	Status     string    `json:"status"`
	OpenDate   time.Time `json:"open_date"`
	CloseDate  time.Time `json:"close_date"`
	NQuestions int       `json:"n_questions"`
	NAnswered  int       `json:"n_answered"`
	Progress   int       `json:"progress"`
}

type CourseModule struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}