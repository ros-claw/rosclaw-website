#!/usr/bin/env bash
set -e

echo "=== ROSClaw Telemetry & Feedback Supabase Setup ==="
echo "This script applies migrations and creates private storage buckets."
echo ""

# Check for supabase CLI
if ! command -v supabase &> /dev/null; then
  echo "Error: supabase CLI not found. Install it first:"
  echo "  npm install -g supabase"
  exit 1
fi

# Link project if not already linked
if [ ! -f "supabase/.temp/project-ref" ]; then
  echo "Please run: supabase link --project-ref <your-project-ref>"
  exit 1
fi

echo "[1/3] Applying migration..."
supabase db push

echo "[2/3] Creating storage buckets..."
supabase storage bucket create feedback-bundles --private || echo "Bucket feedback-bundles may already exist"
supabase storage bucket create feedback-attachments --private || echo "Bucket feedback-attachments may already exist"

echo "[3/3] Verifying buckets..."
supabase storage bucket list

echo ""
echo "=== Setup complete ==="
echo "Next steps:"
echo "  1. Configure Vercel environment variables (see docs/TELEMETRY_FEEDBACK_DEPLOYMENT.md)"
echo "  2. Deploy the website"
echo "  3. Test with curl examples from the deployment guide"
