import hashlib

result = hashlib.sha256("master123".encode()).hexdigest()
print(result)
