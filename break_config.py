import requests
import json

def fetch_firebase_config():
    # Firebase configuration from the APK
    API_KEY = "AIzaSyCyn-aSaYxz9LrMR5iwq4oVhFypdLhy0CI"
    APP_ID = "1:1005397943435:android:aa251a97505ea861e2e08e"
    PROJECT_ID = "dooo-movieshub1-0-1"
    
    # Firebase Remote Config endpoint
    url = f"https://firebaseremoteconfig.googleapis.com/v1/projects/{PROJECT_ID}/namespaces/firebase:fetch?key={API_KEY}"
    
    headers = {
        "Content-Type": "application/json",
        "X-Android-Package": "com.movieshubinpire.android",
        # Sometimes a fingerprint is required, but let's try without first
    }
    
    payload = {
        "appId": APP_ID,
        "appInstanceId": "fake_instance_id", # This can be anything random
        "namespace": "firebase",
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            config = response.json()
            print("Successfully fetched Firebase Remote Config!")
            print(json.dumps(config, indent=2))
        else:
            print("Failed to fetch. Response:")
            print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fetch_firebase_config()
