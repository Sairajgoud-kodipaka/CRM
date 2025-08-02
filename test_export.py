import requests
import json

def test_export_endpoints():
    base_url = "http://localhost:8000/api"
    
    # Test CSV export
    print("Testing CSV export...")
    try:
        response = requests.get(f"{base_url}/clients/export/csv/")
        print(f"CSV Export Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type')}")
        print(f"Content-Disposition: {response.headers.get('content-disposition')}")
        if response.status_code == 200:
            print("✅ CSV export endpoint is working!")
        else:
            print(f"❌ CSV export failed: {response.text}")
    except Exception as e:
        print(f"❌ Error testing CSV export: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test JSON export
    print("Testing JSON export...")
    try:
        response = requests.get(f"{base_url}/clients/export/json/")
        print(f"JSON Export Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type')}")
        print(f"Content-Disposition: {response.headers.get('content-disposition')}")
        if response.status_code == 200:
            print("✅ JSON export endpoint is working!")
        else:
            print(f"❌ JSON export failed: {response.text}")
    except Exception as e:
        print(f"❌ Error testing JSON export: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test XLSX export
    print("Testing XLSX export...")
    try:
        response = requests.get(f"{base_url}/clients/export/xlsx/")
        print(f"XLSX Export Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type')}")
        print(f"Content-Disposition: {response.headers.get('content-disposition')}")
        if response.status_code == 200:
            print("✅ XLSX export endpoint is working!")
        else:
            print(f"❌ XLSX export failed: {response.text}")
    except Exception as e:
        print(f"❌ Error testing XLSX export: {e}")

if __name__ == "__main__":
    test_export_endpoints() 