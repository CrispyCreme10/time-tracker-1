package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Nate96/time-tracker/logger"
)

func initializeLogger() *logger.Logger {
	logInstance, err := logger.NewLogger("movie.log")
	if err != nil {
		log.Fatalf("Failed to initialize logger %v", err)
	}
	return logInstance
}

func main() {
	logInstance := initializeLogger()
	defer logInstance.Close()

	// Env vars
	// if err := godotenv.Load(); err != nil {
	// 	log.Fatal("No .env file was available")
	// }

	// Connect to DB
	// dbConnStr := os.Getenv("DATABASE_URL")
	// if dbConnStr == "" {
	// 	log.Fatal("DATABASE_URL not set")
	// }
	// db, err := sql.Open("postgres", dbConnStr)
	// if err != nil {
	// 	log.Fatalf("Failed to connect to the DB: %v", err)
	// }
	// defer db.Close()

	// Initialize Data Repository for Movies
	// movieRepo, err := data.NewMovieRepository(db, logInstance)
	// if err != nil {
	// 	log.Fatal("Failed to initialize movie repository")
	// }

	// movieHandler := handlers.NewMovieHandler(movieRepo, logInstance)
	// http.HandleFunc("/api/movies/top", movieHandler.GetTopMovies)
	// http.HandleFunc("/api/movies/random", movieHandler.GetRandomMovies)
	// http.HandleFunc("/api/movies/search", movieHandler.SearchMovies)
	// http.HandleFunc("/api/movies/", movieHandler.GetMovie)
	// http.HandleFunc("/api/genres", movieHandler.GetGenres)

	// Handler for static files (frontend)
	http.Handle("/", http.FileServer(http.Dir("public")))
	fmt.Println("Serving the files")

	const addr = ":8080"
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		log.Fatalf("Server failed: %v", err)
		logInstance.Error("Server failed", err)
	}
}
