#!/usr/bin/env bash
# Exit on error
set -o errexit

# We're already in /backend/vchat/ where build.sh is located
# Install dependencies from the parent directory requirements.txt
pip install -r ../requirements.txt

# No need to change directory as we're already in the directory with manage.py

# Convert static asset files
python manage.py collectstatic --no-input

# Create migration files if needed
python manage.py makemigrations

# First migrate only the users app
python manage.py migrate users

# Then migrate the rest of the apps
python manage.py migrate