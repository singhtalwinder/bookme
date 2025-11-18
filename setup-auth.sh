#!/bin/bash

# BookMe Authentication Setup Script
# This script helps you set up Supabase authentication properly

echo "🚀 BookMe Authentication Setup"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f "apps/web/.env.local" ]; then
    echo "⚠️  .env.local not found in apps/web/"
    echo ""
    echo "Creating .env.local template..."
    cat > apps/web/.env.local << EOF
# Supabase Configuration
# Get these values from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
EOF
    echo "✅ Created apps/web/.env.local"
    echo ""
    echo "📝 Please edit apps/web/.env.local and add your Supabase credentials"
    echo "   You can find these in your Supabase Dashboard → Project Settings → API"
    echo ""
else
    echo "✅ Found .env.local"
fi

# Check if metadata migration has been applied
echo ""
echo "📊 Database Migration Check"
echo "---------------------------"
echo ""
echo "You need to apply the metadata columns migration to your database."
echo ""
echo "Option 1: Using Supabase CLI (recommended)"
echo "  cd packages/db"
echo "  supabase db push"
echo ""
echo "Option 2: Manual via Supabase Dashboard"
echo "  1. Go to your Supabase Dashboard"
echo "  2. Navigate to SQL Editor"
echo "  3. Create new query"
echo "  4. Paste contents of: packages/db/supabase/migrations/001_add_metadata_columns.sql"
echo "  5. Run the query"
echo ""

# Check if dependencies are installed
echo "📦 Checking Dependencies"
echo "------------------------"
echo ""

if [ -d "node_modules/@supabase/ssr" ]; then
    echo "✅ @supabase/ssr is installed"
else
    echo "⚠️  @supabase/ssr not found"
    echo "Installing dependencies..."
    pnpm install
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Configure your .env.local with Supabase credentials"
echo "2. Run the database migration"
echo "3. Start the dev server: pnpm dev"
echo "4. Test the auth flow:"
echo "   - Create account: http://localhost:3000/create-account"
echo "   - Login: http://localhost:3000/login"
echo "   - Dashboard: http://localhost:3000/dashboard"
echo ""
echo "📖 For detailed documentation, see: AUTHENTICATION_SETUP_COMPLETE.md"
echo ""

