package models

import "time"

type Entry struct {
	ID          int       `json:"id"`
	InPunch     time.Time `json:"in_punch"`
	OutPunch    time.Time `json:"out_punch"`
	TotalTime   float32   `json:"total_time"`
	TaskName    string    `json:"task_name"`
	TaskComment string    `json:"task_comment"`
}
