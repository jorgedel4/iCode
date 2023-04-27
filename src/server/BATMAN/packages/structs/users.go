package structs

type UsersReq struct {
	UserType string `json:"user_type"`
	Campus   string `json:"campus"`
	ID       string `json:"id"`
	Name     string `json:"name"`
}

type User struct {
	Name   string `json:"name"`
	ID     string `json:"id"`
	Campus string `json:"campus"`
	Email  string `json:"email"`
}
