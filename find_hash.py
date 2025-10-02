import hashlib

# List of common passwords to check
common_passwords = [
    "password",
    "123456",
    "admin123",
    "admin",
    "password123",
    "12345678",
    "qwerty",
    "abc123",
    "letmein",
    "welcome",
    "monkey",
    "1234567890",
    "password1",
    "123123",
    "admin1",
    "root",
    "toor",
    "pass",
    "test",
    "guest",
    "master",
    "login",
    "passw0rd",
    "administrator",
    "changeme",
    "welcome123",
    "admin@123",
    "root123",
    "qwerty123",
    "user",
    "default",
    "secret",
    "123",
    "1234",
    "12345",
    "654321",
    "admin1234",
    "password12",
    "pass123",
    "temp",
    "test123",
]

target_prefix = "e7bc2f973a"

print(f"Looking for SHA256 hash starting with: {target_prefix}\n")

for pwd in common_passwords:
    hash_result = hashlib.sha256(pwd.encode()).hexdigest()
    print(f"{pwd:20} -> {hash_result}")
    
    if hash_result.startswith(target_prefix):
        print(f"\n✓ FOUND! Password '{pwd}' has hash: {hash_result}")
        break
else:
    print(f"\nNo match found in the common passwords list.")
