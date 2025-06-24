package data

import (
	"database/sql"

	"github.com/Nate96/time-tracker/logger"
)

type EntryRepository struct {
	db     *sql.DB
	logger *logger.Logger
}

func NewEntryRepository(db *sql.DB, log *logger.Logger) (*EntryRepository, error) {
	return &EntryRepository{
		db:     db,
		logger: log,
	}, nil
}

// func AddEntry()
