import hashlib

target_hash = "e7bc2f973afb8dfaf00fadfb19596741108be08ab4a107c6a799c429b684c64a"

# Generate variations of "master123"
test_strings = [
    # Different case variations
    "master123",
    "Master123",
    "MASTER123",
    "MaSTeR123",
    "mAsTeR123",
    "MaStEr123",
    "masTeR123",
    "masteR123",
    "masterr123",
    "Master1234",
    
    # With spaces
    "master123 ",
    " master123",
    " master123 ",
    "Master123 ",
    " Master123",
    
    # With newlines
    "master123\n",
    "master123\r\n",
    "Master123\n",
    "Master123\r\n",
    
    # With tabs
    "master123\t",
    "\tmaster123",
    
    # Combinations
    "master 123",
    "Master 123",
    "MASTER 123",
    "master_123",
    "Master_123",
    
    # Numbers first
    "123master",
    "123Master",
    
    # All caps/lowercase combos
    "MASTER 123",
    "master",
    "Master",
    "MASTER",
    
    # With special characters
    "master@123",
    "Master@123",
    "master#123",
    "Master#123",
]

print(f"Target hash: {target_hash}\n")
print("Checking variations...\n")

found = False
for test_str in test_strings:
    hash_result = hashlib.sha256(test_str.encode()).hexdigest()
    
    # Show representation to see whitespace
    display_str = repr(test_str)
    
    if hash_result == target_hash:
        print(f"✓✓✓ FOUND! ✓✓✓")
        print(f"String: {display_str}")
        print(f"Hash:   {hash_result}")
        found = True
        break
    else:
        # Show first few chars of hash for comparison
        match_prefix = "✓" if hash_result.startswith(target_hash[:10]) else " "
        print(f"{match_prefix} {display_str:30} -> {hash_result[:20]}...")

if not found:
    print(f"\n✗ No match found. Let me try more variations...")
    
    # Try more systematic variations
    base_words = ["master", "Master", "MASTER"]
    numbers = ["123", "1234", "12345"]
    
    for word in base_words:
        for num in numbers:
            for suffix in ["", " ", "\n", "\r\n", "\t"]:
                test_str = word + num + suffix
                hash_result = hashlib.sha256(test_str.encode()).hexdigest()
                
                if hash_result == target_hash:
                    print(f"\n✓✓✓ FOUND! ✓✓✓")
                    print(f"String: {repr(test_str)}")
                    print(f"Hash:   {hash_result}")
                    found = True
                    break
            if found:
                break
        if found:
            break

if not found:
    print("\nStill no match. The string might be something else entirely.")
