#!/usr/bin/env bash
# Exit the script on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect static files (like CSS/JS)
python manage.py collectstatic --no-input

# Run database migrations
python manage.py migrate
