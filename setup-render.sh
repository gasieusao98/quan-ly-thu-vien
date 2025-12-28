#!/bin/bash

echo "🚀 Setting up Library Management System for Render deployment"

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found!"
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p frontend/build

# Set permissions
chmod -R 755 backend/uploads

# Create .env files from examples
echo "📄 Creating environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env from example..."
    cp backend/.env.example backend/.env 2>/dev/null || echo "# Backend Environment" > backend/.env
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    echo "Creating frontend/.env..."
    cat > frontend/.env << EOL
REACT_APP_API_URL=https://library-backend.onrender.com
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
EOL
fi

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Upload to GitHub"
echo "2. Connect to Render"
echo "3. Set MONGODB_URI in Render dashboard"
echo "4. Deploy!"