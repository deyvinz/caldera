#!/bin/bash

# NaijaTours API Test Script
# Make sure the API is running on http://localhost:4000

BASE_URL="http://localhost:4000/api"
API_KEY="your-api-key-here"  # Replace with actual API key if needed

echo "🧪 Testing NaijaTours API Endpoints"
echo "=================================="

# Health Check
echo -e "\n1. Health Check"
curl -s -X GET "$BASE_URL/health" | jq '.'

# Get Destinations
echo -e "\n2. Get Destinations"
curl -s -X GET "$BASE_URL/catalog/destinations?limit=5" | jq '.'

# Get Packages
echo -e "\n3. Get Packages"
curl -s -X GET "$BASE_URL/catalog/packages?limit=5" | jq '.'

# Get Package by ID (replace with actual package ID)
echo -e "\n4. Get Package by ID"
PACKAGE_ID="your-package-id-here"  # Replace with actual package ID
curl -s -X GET "$BASE_URL/catalog/packages/$PACKAGE_ID" | jq '.'

# Get Package Composition
echo -e "\n5. Get Package Composition"
curl -s -X GET "$BASE_URL/catalog/packages/$PACKAGE_ID/composition" | jq '.'

# Create Booking
echo -e "\n6. Create Booking"
curl -s -X POST "$BASE_URL/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "packageId": "your-package-id-here",
    "startDate": "2024-06-01",
    "travelers": 2,
    "userId": "your-user-id-here"
  }' | jq '.'

# Get User Bookings
echo -e "\n7. Get User Bookings"
USER_ID="your-user-id-here"  # Replace with actual user ID
curl -s -X GET "$BASE_URL/bookings?userId=$USER_ID&limit=10" | jq '.'

# Create Review
echo -e "\n8. Create Review"
curl -s -X POST "$BASE_URL/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "your-booking-id-here",
    "userId": "your-user-id-here",
    "packageId": "your-package-id-here",
    "rating": 5,
    "comment": "Amazing experience! Highly recommended."
  }' | jq '.'

# Get Package Reviews
echo -e "\n9. Get Package Reviews"
curl -s -X GET "$BASE_URL/reviews?packageId=$PACKAGE_ID&limit=10" | jq '.'

# Send Welcome Email
echo -e "\n10. Send Welcome Email"
curl -s -X POST "$BASE_URL/mailer/send-welcome" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "John Doe"
  }' | jq '.'

# Send Booking Confirmation Email
echo -e "\n11. Send Booking Confirmation Email"
curl -s -X POST "$BASE_URL/mailer/send-booking-confirmation" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "fullName": "John Doe",
    "bookingId": "your-booking-id-here",
    "txRef": "NT_ABC123",
    "totalUSD": 2500,
    "packageTitle": "Luxury Safari Experience",
    "startDate": "2024-06-01",
    "endDate": "2024-06-08",
    "travelers": 2
  }' | jq '.'

echo -e "\n✅ API Testing Complete!"
echo -e "\n📚 API Documentation: $BASE_URL/docs"
echo -e "🔍 Health Status: $BASE_URL/health"
