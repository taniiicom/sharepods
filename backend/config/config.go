package config

import "os"

func DatabaseURL() (string, bool) {
	return os.LookupEnv("DATABASE_URL")
}
