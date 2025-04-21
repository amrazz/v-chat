#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies from the parent directory requirements.txt
pip install -r ../requirements.txt

# No need to change directory as we're already in the directory with manage.py

# Convert static asset files
python manage.py collectstatic --no-input

# Create initial migrations for the users app specifically
python manage.py makemigrations users

# Create any other needed migrations
python manage.py makemigrations

# Then apply all migrations at once (without trying to migrate users separately)
python manage.py migrate