#!/bin/bash

# E-Commerce Payment API Test Script
# This script tests all the API endpoints

BASE_URL="http://localhost:3000"

echo "🧪 Testing E-Commerce Payment API"
echo "=================================="
echo ""

# Test 1: Health Check
echo "1️⃣ Testing Health Check..."
curl -s "$BASE_URL/health" | jq '.'
echo ""
echo ""

# Test 2: Get All Products
echo "2️⃣ Getting All Products..."
curl -s "$BASE_URL/api/products" | jq '.'
echo ""
echo ""

# Test 3: Get Single Product
echo "3️⃣ Getting Single Product (ID: 1)..."
curl -s "$BASE_URL/api/products/1" | jq '.'
echo ""
echo ""

# Test 4: Create Payment (Success)
echo "4️⃣ Creating Payment..."
curl -s -X POST "$BASE_URL/api/payments" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 2,
    "cardNumber": "4532015112830366",
    "cvv": "123",
    "expiryDate": "12/25",
    "email": "customer@example.com"
  }' | jq '.'
echo ""
echo ""

# Test 5: Get All Payments
echo "5️⃣ Getting All Payments..."
curl -s "$BASE_URL/api/payments" | jq '.'
echo ""
echo ""

# Test 6: Invalid Payment (Bad Card)
echo "6️⃣ Testing Invalid Payment..."
curl -s -X POST "$BASE_URL/api/payments" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 2,
    "quantity": 1,
    "cardNumber": "123",
    "cvv": "12",
    "expiryDate": "invalid",
    "email": "test@example.com"
  }' | jq '.'
echo ""
echo ""

echo "✅ Testing Complete!"
echo ""
echo "Note: If you don't have 'jq' installed, remove '| jq' from the commands"