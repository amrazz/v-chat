#!/usr/bin/env bash
# Exit on error
set -o errexit

# Navigate to the correct directory
cd "$(dirname "$0")"

# Modify this line as needed for your package manager (pip, poetry, etc.)
pip install -r requirements.txt

# Convert static asset files
python manage.py collectstatic --no-input

python manage.py makemigrations

# First migrate only the users app
python manage.py migrate users

# Then migrate the rest
python manage.py migrate