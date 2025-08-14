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
        transactions = _parse_excel(file_stream, filename)
    elif filename.endswith('.pdf'):
        transactions = _parse_pdf(file_stream)
    else:
        raise ValueError("Unsupported file type.")

    saved_transactions = []
    skipped_count = 0
    for t_data in transactions:
        try:
            amount = float(t_data.get('amount'))
            description = t_data.get('description', '')
            category = t_data.get('category', 'Uncategorized')
            transaction_type = t_data.get('transaction_type', 'expense')
            timestamp = pd.to_datetime(t_data.get('timestamp')).to_pydatetime() if t_data.get('timestamp') else datetime.utcnow()

            # Check for existing transaction
            existing_transaction = Transaction.query.filter_by(
                user_id=user_id,
                account_id=account_id,
                timestamp=timestamp,
                amount=amount,
                description=description
            ).first()

            if existing_transaction:
                skipped_count += 1
                continue

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
    return {
        "saved_transactions": saved_transactions,
        "processed_count": len(saved_transactions),
        "skipped_count": skipped_count
    }

def _parse_excel(file_stream, filename):
    print(f"Attempting to parse Excel file: {filename}")
    df = None
    is_html = False
    try:
        if filename.endswith('.xls'):
            df = pd.read_excel(file_stream, engine='xlrd')
        elif filename.endswith('.xlsx'):
            df = pd.read_excel(file_stream, engine='openpyxl')
        else:
            raise ValueError("Unsupported Excel file extension.")
        print(f"Successfully read Excel file: {filename}")
    except Exception as e:
        if "Expected BOF record" in str(e) or "CompDoc" in str(e):
            print("Standard Excel parsing failed. Attempting to parse as HTML.")
            try:
                file_stream.seek(0)
                dfs = pd.read_html(file_stream)
                if not dfs:
                    raise ValueError("No tables found in HTML.")
                df = dfs[0]
                is_html = True
                print(f"Successfully parsed HTML file masquerading as Excel: {filename}")
            except Exception as html_e:
                print(f"HTML parsing also failed: {html_e}")
                raise e from html_e
        else:
            print(f"Error reading Excel file {filename}: {e}")
            raise

    if df is None:
        raise ValueError("DataFrame could not be created.")

    if is_html:
        text = df.iloc[0, 0]
        header_marker = "Trans DateReferenceValue DateDebitCreditBalanceRemarks"
        try:
            content = text.split(header_marker, 1)[1]
            footer_marker = "PLEASE DIRECT ALL ENQUIRIES"
            content = content.split(footer_marker, 1)[0]
        except IndexError:
            raise ValueError("Could not find transaction data in the HTML file in the expected format.")

        # Split content into transaction blocks. A new transaction starts with a date followed by a single quote.
        transaction_blocks = re.split(r"(?=\d{2}-\w{3}-\d{4}')", content)
        
        transactions_data = []
        
        # Regex to parse a single transaction block
        pattern = re.compile(
            r"^(?P<date>\d{2}-\w{3}-\d{4})'"  # Transaction date
            r".*?"                               # Reference text (non-greedy)
            r"(?P<value_date>\d{2}-\w{3}-\d{4})\s+"
            r"(?P<amount1>[\d,]+\.\d{2})?\s*"
            r"(?P<balance>[\d,]+\.\d{2})\s+"
            r"(?P<description>.*)$"
        )

        for block in transaction_blocks:
            if not block.strip():
                continue
            
            # Normalize whitespace in the block
            block = re.sub(r'\s+', ' ', block).strip()
            
            match = pattern.match(block)
            
            if match:
                data = match.groupdict()
                amount = 0.0
                if data.get('amount1'):
                    amount = float(data['amount1'].replace(',', ''))
                
                transactions_data.append({
                    'amount': amount,
                    'description': data['description'].strip(),
                    'category': 'Uncategorized',
                    'timestamp': datetime.strptime(data['date'], '%d-%b-%Y'),
                    'balance': float(data['balance'].replace(',', ''))
                })

        if not transactions_data:
            return []

        # Determine transaction type based on balance changes
        opening_balance_match = re.search(r"Opening Balance: ([\d,]+\.\d{2})", text)
        last_balance = float(opening_balance_match.group(1).replace(',', '')) if opening_balance_match else 0.0
        
        for t in transactions_data:
            balance = t.pop('balance')
            # If there's no amount, it's likely a fee or a line with no transaction data
            if t['amount'] == 0.0:
                 # Special case for things like "Electronic Money Transfer Levy"
                 # Let's see if we can find a debit/credit from the description
                 if "Electronic Money Transfer Levy" in t['description']:
                     # This is an expense, but the amount is missing from the main column
                     # We need to extract it from the description if possible, but for now, let's assume it's an expense
                     t['transaction_type'] = 'expense'
                 else:
                    t['transaction_type'] = 'expense' # Default for safety
            elif balance > last_balance:
                t['transaction_type'] = 'income'
            else:
                t['transaction_type'] = 'expense'
            last_balance = balance
            
        return transactions_data

    # Original logic for standard Excel files
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

    # Replace soft hyphens with regular hyphens for consistency
    text = text.replace('­', '-')

    transactions = []
    lines = text.split('\n')

    # Regex to find the start of a transaction line
    # This pattern looks for the date, reference, value date, optional debit/credit, balance, and the start of remarks.
    transaction_line_pattern = re.compile(
        r"^(?P<date>\d{2}-\w{3}-\d{4})\s+"  # Date (e.g., 04-Aug-2025)
        r"'[^\\]+\s+"                         # Reference (e.g., '00284... ) - match up to the next space after the opening quote
        r"(\d{2}-\w{3}-\d{4})\s+"           # Value Date (e.g., 04-Aug-2025)
        r"(?P<debit>[\d,]+\.\d{2})?\s*"     # Optional Debit amount
        r"(?P<credit>[\d,]+\.\d{2})?\s*"    # Optional Credit amount
        r"(?P<balance>[\d,]+\.\d{2})\s*"    # Balance
        r"(?P<remarks_start>.*)"            # Start of remarks (rest of the line)
    )

    current_transaction_data = None
    current_remarks_lines = []

    for line in lines:
        match = transaction_line_pattern.match(line)

        if match:
            # If we found a new transaction, process the previous one (if any)
            if current_transaction_data:
                full_remarks = " ".join(current_remarks_lines).strip()
                current_transaction_data['remarks'] = full_remarks
                transactions.append(current_transaction_data)

            # Start a new transaction
            data = match.groupdict()
            current_transaction_data = {
                'date': data['date'],
                'debit': data.get('debit'),
                'credit': data.get('credit'),
                'balance': data['balance'],
                'remarks_start': data['remarks_start']
            }
            current_remarks_lines = [data['remarks_start']]
        elif current_transaction_data:
            # If we are in a transaction block, add this line to remarks
            current_remarks_lines.append(line.strip())

    # Process the last transaction after the loop
    if current_transaction_data:
        full_remarks = " ".join(current_remarks_lines).strip()
        current_transaction_data['remarks'] = full_remarks
        transactions.append(current_transaction_data)

    # Now, convert the extracted data into the desired transaction format
    parsed_transactions = []
    for t_data in transactions:
        try:
            amount = 0.0
            transaction_type = 'expense' # Default

            if t_data['debit']:
                amount = float(t_data['debit'].replace(',', ''))
                transaction_type = 'expense'
            elif t_data['credit']:
                amount = float(t_data['credit'].replace(',', ''))
                transaction_type = 'income'
            else:
                # This should ideally not happen if the regex is good
                continue

            timestamp = datetime.strptime(t_data['date'], '%d-%b-%Y')

            parsed_transactions.append({
                'amount': amount,
                'description': t_data['remarks'],
                'category': 'Uncategorized',
                'transaction_type': transaction_type,
                'timestamp': timestamp
            })
        except Exception as e:
            print(f"Error processing extracted transaction data: {t_data} - {e}")

    if not parsed_transactions:
        print("No transactions were parsed from the PDF. The regex or parsing logic may need adjustment.")
        return []

    return parsed_transactions
