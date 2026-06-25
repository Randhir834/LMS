#!/bin/bash

# Script to apply folder_path migration to course_materials table
# Run this after pulling the folder upload feature

echo "========================================="
echo "Applying folder_path migration"
echo "========================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo ""
    echo "Please set your database connection:"
    echo "  export DATABASE_URL='postgresql://user:password@localhost:5432/playfit_lms'"
    echo ""
    exit 1
fi

# Navigate to backend directory
cd "$(dirname "$0")/backend" || exit 1

echo "📁 Current directory: $(pwd)"
echo ""

# Check if migration file exists
MIGRATION_FILE="src/models/migrations/add_folder_path_to_materials.sql"
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ ERROR: Migration file not found: $MIGRATION_FILE"
    exit 1
fi

echo "📄 Migration file found: $MIGRATION_FILE"
echo ""

# Show migration content
echo "========================================="
echo "Migration SQL:"
echo "========================================="
cat "$MIGRATION_FILE"
echo ""
echo "========================================="
echo ""

# Ask for confirmation
read -p "Do you want to apply this migration? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Migration cancelled"
    exit 0
fi

echo ""
echo "🚀 Applying migration..."
echo ""

# Apply migration
psql "$DATABASE_URL" -f "$MIGRATION_FILE"

# Check if migration was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "✅ Migration applied successfully!"
    echo "========================================="
    echo ""
    echo "Next steps:"
    echo "1. Restart your backend server"
    echo "2. Clear frontend caches (rm -rf .next in admin and instructor)"
    echo "3. Restart frontend servers"
    echo "4. Test folder upload feature"
    echo ""
else
    echo ""
    echo "========================================="
    echo "❌ Migration failed!"
    echo "========================================="
    echo ""
    echo "Please check the error message above"
    echo "and verify your database connection"
    echo ""
    exit 1
fi
