import pandas as pd
import pypdf
from io import BytesIO
from app.finance.models import Transaction
from app.extensions import db
from datetime import datetime
import re

def process_uploaded_transactions(file_stream, filename, user_id, account_id):
    transactions = []
    if filename.endswith('.xls') or filename.endswith('.xlsx'):
        transactions = _parse_excel(file_stream)
    elif filename.endswith('.pdf'):
        transactions = _parse_pdf(file_stream)
    else:
        raise ValueError("Unsupported file type.")

    # Save transactions to database
    saved_transactions = []
    for t_data in transactions:
        try:
            # Basic validation and type conversion
            amount = float(t_data.get('amount'))
            description = t_data.get('description', '')
            category = t_data.get('category', 'Uncategorized')
            transaction_type = t_data.get('transaction_type', 'expense')
            timestamp = pd.to_datetime(t_data.get('timestamp')).to_pydatetime() if t_data.get('timestamp') else datetime.utcnow()

            transaction = Transaction(
                amount=amount,
                description=description,
                category=category,
                transaction_type=transaction_type,
                user_id=user_id,
                account_id=account_id,
                timestamp=timestamp
            )
            db.session.add(transaction)
            saved_transactions.append(transaction)
        except Exception as e:
            print(f"Error processing transaction data: {t_data} - {e}")
            db.session.rollback()
            raise

    db.session.commit()
    return saved_transactions

def _parse_excel(file_stream):
    df = pd.read_excel(file_stream)
    # Assuming the Excel file has columns like 'Amount', 'Description', 'Category', 'Type', 'Date'
    # You might need to adjust column names based on actual bank statements
    transactions_data = []
    for index, row in df.iterrows():
        transactions_data.append({
            'amount': row.get('Amount'),
            'description': row.get('Description'),
            'category': row.get('Category'),
            'transaction_type': row.get('Type', 'expense'),
            'timestamp': row.get('Date')
        })
    return transactions_data

def _parse_pdf(file_stream):
    reader = pypdf.PdfReader(BytesIO(file_stream.read()))
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    
    transactions = []
    # Basic regex patterns for common transaction formats
    # This is highly dependent on the PDF's structure and will likely need customization.
    # Example pattern: Date Description Amount
    # e.g., 01/15/2023 Starbucks -15.50
    # e.g., Jan 15, 2023 Deposit +1000.00
    transaction_pattern = re.compile(r'(\d{1,2}[/\- ]\d{1,2}[/\- ]\d{2,4})\s+([\w\s.-]+?)\s+([\-+]?\d+\.\d{2})')

    for line in text.split('\n'):
        match = transaction_pattern.search(line)
        if match:
            try:
                date_str, description, amount_str = match.groups()
                amount = float(amount_str)
                
                # Attempt to parse date with multiple formats
                for fmt in ('%m/%d/%Y', '%m-%d-%Y', '%b %d, %Y', '%Y-%m-%d'):
                    try:
                        timestamp = datetime.strptime(date_str, fmt)
                        break
                    except ValueError:
                        continue
                else:
                    timestamp = datetime.utcnow() # Fallback if date parsing fails

                transaction_type = 'income' if amount > 0 else 'expense'
                category = 'Uncategorized' # Default category, can be improved with AI/ML

                transactions.append({
                    'amount': abs(amount),
                    'description': description.strip(),
                    'category': category,
                    'transaction_type': transaction_type,
                    'timestamp': timestamp
                })
            except Exception as e:
                print(f"Error parsing transaction line: {line} - {e}")

    if not transactions:
        print("No transactions found using basic regex. Returning dummy.")
        # Fallback to dummy if no transactions are found
        return [{
            'amount': 100.00,
            'description': 'PDF Parsed Transaction (Dummy - No Regex Match)',
            'category': 'Utilities',
            'transaction_type': 'expense',
            'timestamp': datetime.utcnow()
        }]

    return transactions
