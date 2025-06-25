import hashlib
import json
import time


class Blockchain:
    def __init__(self):
        self.chain = []
        self.current_transactions = []
        self.balances = {}  # Simple ledger: address -> balance
        self.create_block(proof=1, previous_hash="0")  # Genesis block

    def create_block(self, proof, previous_hash):
        block = {
            "index": len(self.chain) + 1,
            "timestamp": time.time(),
            "transactions": self.current_transactions,
            "proof": proof,
            "previous_hash": previous_hash,
        }
        self.chain.append(block)
        self.current_transactions = []
        return block

    def add_transaction(self, sender, recipient, amount):
        # Check sender balance
        if sender != "SYSTEM" and self.balances.get(sender, 0) < amount:
            return False  # Insufficient balance
        # Update balances
        if sender != "SYSTEM":
            self.balances[sender] -= amount
        self.balances[recipient] = self.balances.get(recipient, 0) + amount

        # Add transaction to pool
        self.current_transactions.append(
            {
                "sender": sender,
                "recipient": recipient,
                "amount": amount,
            }
        )
        return True

    @property
    def last_block(self):
        return self.chain[-1]

    @staticmethod
    def hash(block):
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def proof_of_work(self, last_proof):
        proof = 0
        while not self.valid_proof(last_proof, proof):
            proof += 1
        return proof

    @staticmethod
    def valid_proof(last_proof, proof):
        guess = f"{last_proof}{proof}".encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"
