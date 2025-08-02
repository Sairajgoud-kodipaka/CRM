import requests
import json

# Test URL validation in tenant creation
BASE_URL = 'http://localhost:8000/api'

def test_login():
    """Test login with platform admin user"""
    login_data = {
        'username': 'Sairaj',
        'password': 'demo123'
    }
    
    response = requests.post(f'{BASE_URL}/auth/login/', json=login_data)
    print(f"Login Status: {response.status_code}")
    
    if response.status_code == 200:
        return response.json()
    return None

def test_tenant_creation_with_urls(token):
    """Test tenant creation with different URL formats"""
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # Test cases with different URL formats
    test_cases = [
        {
            'name': 'Test Store 1',
            'website': 'www.example.com',
            'description': 'Test with www format'
        },
        {
            'name': 'Test Store 2', 
            'website': 'https://www.example.com',
            'description': 'Test with https format'
        },
        {
            'name': 'Test Store 3',
            'website': '',
            'description': 'Test with empty website'
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        tenant_data = {
            'name': test_case['name'],
            'business_type': 'jewelry_store',
            'industry': 'jewelry',
            'description': test_case['description'],
            'email': f'test{i}@example.com',
            'phone': '+1234567890',
            'address': '123 Test Street',
            'website': test_case['website'],
            'subscription_plan': 'professional',
            'admin_username': f'testadmin{i}',
            'admin_email': f'admin{i}@test.com',
            'admin_password': 'testpass123'
        }
        
        print(f"\nTesting case {i}: {test_case['description']}")
        print(f"Website: '{test_case['website']}'")
        
        response = requests.post(f'{BASE_URL}/tenants/create/', json=tenant_data, headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Success!")
            result = response.json()
            print(f"Created tenant: {result['name']}")
            print(f"Website in response: {result['website']}")
        else:
            print("❌ Failed!")
            print(f"Error: {response.json()}")

if __name__ == "__main__":
    print("Testing URL validation in tenant creation...")
    
    # Test login
    print("\n1. Testing login:")
    auth_data = test_login()
    
    if auth_data and auth_data.get('success'):
        token = auth_data.get('token')
        user = auth_data.get('user')
        print(f"Login successful for user: {user.get('username')} with role: {user.get('role')}")
        
        # Test tenant creation with different URL formats
        print("\n2. Testing tenant creation with URL validation:")
        test_tenant_creation_with_urls(token)
    else:
        print("❌ Login failed") 