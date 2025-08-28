#!/usr/bin/env python3
"""
EasyFinance Seed Data Generator
Populates the database with realistic test data for development and testing
"""

import os
import sys
from datetime import datetime, date, timedelta
import random

# Add the app directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.auth.models import User, Team, TeamMember, Plan, Subscription
from app.finance.models import Account, Transaction, Budget
from app.wealth.models import Investment, SavingsGoal, Notification, PriceAlert
from app.blockchain.models import CryptoWallet, DeFiPosition, NFTCollection
from app.chat.models import ChatRoom, ChatMessage, ChatParticipant
from app.support.models import SupportArticle, FAQ

def create_users():
    """Create sample users"""
    users_data = [
        {
            "username": "john_doe",
            "email": "john@easyfinance.com",
            "role": "user",
            "password": "password123"
        },
        {
            "username": "jane_smith",
            "email": "jane@easyfinance.com", 
            "role": "user",
            "password": "password123"
        },
        {
            "username": "mike_wilson",
            "email": "mike@easyfinance.com",
            "role": "user", 
            "password": "password123"
        },
        {
            "username": "admin_user",
            "email": "admin@easyfinance.com",
            "role": "admin",
            "password": "admin123"
        }
    ]
    
    users = []
    for user_data in users_data:
        user = User(
            username=user_data["username"],
            email=user_data["email"],
            role=user_data["role"]
        )
        user.set_password(user_data["password"])
        db.session.add(user)
        users.append(user)
    

    print(f"✅ Created {len(users)} users")
    return users

def create_teams_and_subscriptions(users):
    """Creates plans, and for each user, creates a team, makes them an admin, and subscribes the team to the Free plan."""
    plans_data = [
        {
            "name": "Free",
            "price": 0.0,
            "features": {
                "max_accounts": 2,
                "max_budgets": 3,
                "ai_chat": False,
                "advanced_reporting": False,
                "max_goals": 2,
                "max_wallets": 1,
                "defi_tracking": False,
                "nft_tracking": False,
                "multi_user_teams": False
            }
        },
        {
            "name": "Pro",
            "price": 15.0,
            "features": {
                "max_accounts": 10,
                "max_budgets": 10,
                "ai_chat": True,
                "advanced_reporting": True,
                "max_goals": 10,
                "max_wallets": 5,
                "defi_tracking": True,
                "nft_tracking": True,
                "multi_user_teams": True
            }
        },
        {
            "name": "Enterprise",
            "price": -1,  # -1 indicates "Contact Us"
            "features": {
                "multi_user_teams": True,
                "role_based_access": True,
                "team_dashboards": True,
                "audit_logs": True,
                "sso_integration": True,
                "max_accounts": 999,
                "max_budgets": 999,
                "ai_chat": True,
                "advanced_reporting": True,
                "max_goals": 999,
                "max_wallets": 999,
                "defi_tracking": True,
                "nft_tracking": True
            }
        }
    ]

    plans = []
    for plan_data in plans_data:
        plan = Plan(**plan_data)
        db.session.add(plan)
        plans.append(plan)
    db.session.flush()
    print(f"✅ Created {len(plans)} subscription plans")

    free_plan = next(p for p in plans if p.name == "Free")
    teams = []
    subscriptions = []

    for user in users:
        if user.role == 'admin':
            continue

        team = Team(name=f"{user.username}'s Team")
        db.session.add(team)
        db.session.flush()  # Get team ID
        teams.append(team)

        member = TeamMember(user_id=user.id, team_id=team.id, role='admin')
        db.session.add(member)

        subscription = Subscription(team_id=team.id, plan_id=free_plan.id, status='active')
        db.session.add(subscription)
        subscriptions.append(subscription)

    print(f"✅ Created {len(teams)} default teams")
    print(f"✅ Created {len(subscriptions)} default subscriptions for teams")
    return plans, teams, subscriptions

def create_accounts(users):
    """Create sample accounts for users"""
    # NOTE: In a true multi-tenant app, accounts would also have a team_id.
    # For this seeder, we'll keep them associated with the user who created them.
    account_types = ["checking", "savings", "credit"]
    accounts = []
    
    for user in users[:3]:  # Skip admin user
        investment_account = Account(
            name=f"{user.username.title()}'s Investment",
            account_type="investment",
            balance=round(random.uniform(1000, 25000), 2),
            currency="USD",
            user_id=user.id
        )
        db.session.add(investment_account)
        accounts.append(investment_account)

        for i in range(random.randint(1, 2)):
            account_type = random.choice(account_types)
            balance = random.uniform(100, 10000) if account_type != "credit" else random.uniform(-2000, 0)
            
            account = Account(
                name=f"{user.username.title()}'s {account_type.title()}",
                account_type=account_type,
                balance=round(balance, 2),
                currency="USD",
                user_id=user.id
            )
            db.session.add(account)
            accounts.append(account)
    

    print(f"✅ Created {len(accounts)} accounts")
    return accounts

def create_transactions(users, accounts):
    """Create sample transactions"""
    categories = ["food", "transport", "entertainment", "utilities", "shopping", "healthcare", "education", "salary", "freelance"]
    descriptions = {
        "food": ["Starbucks Coffee", "McDonald's", "Grocery Store", "Pizza Hut", "Local Restaurant"],
        "transport": ["Uber Ride", "Gas Station", "Parking Fee", "Bus Ticket", "Taxi"],
        "entertainment": ["Netflix", "Movie Theater", "Concert Ticket", "Gaming", "Spotify"],
        "utilities": ["Electric Bill", "Water Bill", "Internet", "Phone Bill", "Gas Bill"],
        "shopping": ["Amazon Purchase", "Target", "Walmart", "Online Shopping", "Clothing Store"],
        "healthcare": ["Doctor Visit", "Pharmacy", "Dental", "Insurance", "Medical"],
        "education": ["Course Fee", "Books", "Online Learning", "Workshop", "Certification"],
        "salary": ["Monthly Salary", "Bonus", "Overtime Pay", "Commission"],
        "freelance": ["Client Payment", "Project Fee", "Consulting", "Design Work"]
    }
    
    transactions = []
    
    for user in users[:3]:
        user_accounts = [acc for acc in accounts if acc.user_id == user.id]
        
        for _ in range(random.randint(20, 50)):
            account = random.choice(user_accounts)
            category = random.choice(categories)
            description = random.choice(descriptions[category])
            
            if category in ["salary", "freelance"]:
                transaction_type = "income"
                amount = random.uniform(1000, 5000)
            else:
                transaction_type = "expense"
                amount = random.uniform(5, 500)
            
            transaction_date = datetime.now() - timedelta(days=random.randint(1, 90))
            
            transaction = Transaction(
                amount=round(amount, 2),
                transaction_type=transaction_type,
                category=category,
                description=description,
                user_id=user.id,
                account_id=account.id,
                timestamp=transaction_date
            )
            db.session.add(transaction)
            transactions.append(transaction)
    

    print(f"✅ Created {len(transactions)} transactions")
    return transactions

def create_budgets(users):
    """Create sample budgets"""
    budget_categories = [
        {"name": "Food & Dining", "category": "food", "limit": 600},
        {"name": "Transportation", "category": "transport", "limit": 300},
        {"name": "Entertainment", "category": "entertainment", "limit": 200},
        {"name": "Utilities", "category": "utilities", "limit": 250},
        {"name": "Shopping", "category": "shopping", "limit": 400}
    ]
    
    budgets = []
    
    for user in users[:3]:
        for budget_data in random.sample(budget_categories, 3):
            budget = Budget(
                name=budget_data["name"],
                category=budget_data["category"],
                limit=budget_data["limit"],
                spent=random.uniform(0, budget_data["limit"] * 0.8),
                user_id=user.id,
                period_start=date.today().replace(day=1),
                period_end=(date.today().replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            )
            db.session.add(budget)
            budgets.append(budget)
    

    print(f"✅ Created {len(budgets)} budgets")
    return budgets

def create_investments(users, accounts):
    """Create sample investments"""
    stocks = [
        {"symbol": "AAPL", "name": "Apple Inc.", "price": 175.00},
        {"symbol": "GOOGL", "name": "Alphabet Inc.", "price": 2800.00},
        {"symbol": "MSFT", "name": "Microsoft Corp.", "price": 380.00},
        {"symbol": "TSLA", "name": "Tesla Inc.", "price": 250.00},
        {"symbol": "AMZN", "name": "Amazon.com Inc.", "price": 145.00},
        {"symbol": "NVDA", "name": "NVIDIA Corp.", "price": 480.00}
    ]
    
    investments = []
    
    for user in users[:3]:
        investment_accounts = [acc for acc in accounts if acc.user_id == user.id and acc.account_type == "investment"]
        if not investment_accounts:
            continue
            
        account = investment_accounts[0]
        
        for stock in random.sample(stocks, random.randint(3, 5)):
            quantity = random.randint(1, 20)
            purchase_price = stock["price"] * random.uniform(0.8, 1.2)
            
            investment = Investment(
                symbol=stock["symbol"],
                name=stock["name"],
                quantity=quantity,
                purchase_price=round(purchase_price, 2),
                current_price=stock["price"],
                investment_type="stock",
                user_id=user.id,
                account_id=account.id,
                purchase_date=date.today() - timedelta(days=random.randint(30, 365))
            )
            db.session.add(investment)
            investments.append(investment)
    
    print(f"✅ Created {len(investments)} investments")
    return investments

def create_savings_goals(users):
    """Create sample savings goals"""
    goal_templates = [
        {"name": "Emergency Fund", "target": 10000, "priority": "high"},
        {"name": "Vacation to Europe", "target": 5000, "priority": "medium"},
        {"name": "New Car Down Payment", "target": 8000, "priority": "high"},
        {"name": "Home Renovation", "target": 15000, "priority": "medium"},
        {"name": "Wedding Fund", "target": 20000, "priority": "high"},
        {"name": "Retirement Boost", "target": 50000, "priority": "low"}
    ]
    
    goals = []
    
    for user in users[:3]:
        for goal_template in random.sample(goal_templates, random.randint(2, 3)):
            current_amount = random.uniform(0, goal_template["target"] * 0.6)
            target_date = date.today() + timedelta(days=random.randint(180, 730))
            
            goal = SavingsGoal(
                name=goal_template["name"],
                description=f"Saving for {goal_template['name'].lower()}",
                target_amount=goal_template["target"],
                current_amount=round(current_amount, 2),
                deadline=target_date,
                priority=goal_template["priority"],
                user_id=user.id,
                is_completed=current_amount >= goal_template["target"]
            )
            db.session.add(goal)
            goals.append(goal)
    
    print(f"✅ Created {len(goals)} savings goals")
    return goals

def create_crypto_wallets(users):
    """Create sample crypto wallets"""
    crypto_currencies = [
        {"currency": "BTC", "balance": 0.5},
        {"currency": "ETH", "balance": 2.5},
        {"currency": "USDC", "balance": 1000},
        {"currency": "ADA", "balance": 500},
        {"currency": "SOL", "balance": 10}
    ]
    
    wallets = []
    
    for user in users[:3]:
        for crypto in random.sample(crypto_currencies, random.randint(2, 3)):
            wallet = CryptoWallet(
                name=f"{crypto['currency']} Wallet",
                address=f"{('1' if crypto['currency'] == 'BTC' else '0x')}{''.join(random.choices('0123456789abcdef', k=40))}",
                currency=crypto["currency"],
                balance=crypto["balance"] * random.uniform(0.1, 2.0),
                network="mainnet",
                wallet_type=random.choice(["hot", "cold"]),
                user_id=user.id
            )
            db.session.add(wallet)
            wallets.append(wallet)
    
    print(f"✅ Created {len(wallets)} crypto wallets")
    return wallets

def create_defi_positions(users, wallets):
    """Create sample DeFi positions"""
    protocols = [
        {"protocol": "Uniswap", "type": "liquidity", "apy": 12.5},
        {"protocol": "Aave", "type": "lending", "apy": 8.2},
        {"protocol": "Compound", "type": "lending", "apy": 6.8},
        {"protocol": "Curve", "type": "liquidity", "apy": 15.3},
        {"protocol": "Yearn", "type": "staking", "apy": 9.7}
    ]
    
    positions = []
    
    for user in users[:3]:
        user_wallets = [w for w in wallets if w.user_id == user.id]
        if not user_wallets:
            continue
            
        for protocol in random.sample(protocols, random.randint(1, 2)):
            wallet = random.choice(user_wallets)
            amount_deposited = random.uniform(500, 5000)
            
            position = DeFiPosition(
                protocol=protocol["protocol"],
                position_type=protocol["type"],
                token_pair="ETH/USDC" if protocol["type"] == "liquidity" else None,
                amount_deposited=round(amount_deposited, 2),
                current_value=round(amount_deposited * random.uniform(0.95, 1.15), 2),
                apy=protocol["apy"],
                rewards_earned=round(amount_deposited * protocol["apy"] / 100 * 0.25, 2),
                user_id=user.id,
                wallet_id=wallet.id
            )
            db.session.add(position)
            positions.append(position)
    
    print(f"✅ Created {len(positions)} DeFi positions")
    return positions

def create_nfts(users, wallets):
    """Create sample NFT collections"""
    nft_collections = [
        {"name": "Bored Ape #1234", "contract": "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", "price": 50.0},
        {"name": "CryptoPunk #5678", "contract": "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB", "price": 75.0},
        {"name": "Azuki #9012", "contract": "0xED5AF388653567Af2F388E6224dC7C4b3241C544", "price": 15.0},
        {"name": "Doodle #3456", "contract": "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e", "price": 8.0}
    ]
    
    nfts = []
    
    for user in users[:2]:
        user_wallets = [w for w in wallets if w.user_id == user.id and w.currency == "ETH"]
        if not user_wallets:
            continue
            
        wallet = user_wallets[0]
        
        for nft_data in random.sample(nft_collections, random.randint(1, 2)):
            purchase_price = nft_data["price"] * random.uniform(0.7, 1.3)
            
            nft = NFTCollection(
                name=nft_data["name"],
                contract_address=nft_data["contract"],
                token_id=str(random.randint(1000, 9999)),
                purchase_price=round(purchase_price, 2),
                current_price=nft_data["price"],
                currency="ETH",
                marketplace="OpenSea",
                user_id=user.id,
                wallet_id=wallet.id
            )
            db.session.add(nft)
            nfts.append(nft)
    
    print(f"✅ Created {len(nfts)} NFTs")
    return nfts

def create_notifications(users):
    """Create sample notifications"""
    notification_types = [
        {"title": "Budget Alert", "message": "You've spent 80% of your food budget", "type": "budget_alert", "priority": "medium"},
        {"title": "Price Alert", "message": "Bitcoin has reached your target price of $45,000", "type": "price_alert", "priority": "high"},
        {"title": "Goal Achievement", "message": "Congratulations! You've reached your Emergency Fund goal", "type": "goal_achievement", "priority": "high"},
        {"title": "DeFi Rewards", "message": "You've earned $25.50 in Uniswap rewards", "type": "defi_reward", "priority": "medium"},
        {"title": "Transaction Alert", "message": "Large transaction detected: $1,500 expense", "type": "transaction_alert", "priority": "medium"}
    ]
    
    notifications = []
    
    for user in users[:3]:
        for notif_data in random.sample(notification_types, random.randint(3, 5)):
            notification = Notification(
                title=notif_data["title"],
                message=notif_data["message"],
                notification_type=notif_data["type"],
                priority=notif_data["priority"],
                is_read=random.choice([True, False]),
                user_id=user.id,
                created_at=datetime.now() - timedelta(days=random.randint(1, 30))
            )
            if notification.is_read:
                notification.read_at = notification.created_at + timedelta(hours=random.randint(1, 48))
            
            db.session.add(notification)
            notifications.append(notification)
    
    print(f"✅ Created {len(notifications)} notifications")
    return notifications

def create_price_alerts(users):
    """Create sample price alerts"""
    alert_symbols = ["BTC", "ETH", "AAPL", "GOOGL", "TSLA"]
    
    alerts = []
    
    for user in users[:3]:
        for symbol in random.sample(alert_symbols, random.randint(2, 3)):
            target_price = random.uniform(100, 50000)
            
            alert = PriceAlert(
                symbol=symbol,
                target_price=round(target_price, 2),
                condition=random.choice(["above", "below"]),
                is_active=True,
                is_triggered=random.choice([True, False]),
                user_id=user.id
            )
            
            if alert.is_triggered:
                alert.triggered_at = datetime.now() - timedelta(days=random.randint(1, 7))
            
            db.session.add(alert)
            alerts.append(alert)
    
    print(f"✅ Created {len(alerts)} price alerts")
    return alerts

def create_chat_rooms(users):
    """Create sample chat rooms and messages"""
    rooms = []
    
    for user in users[:3]:
        room = ChatRoom(name=f"{user.username}'s Financial Chat")
        db.session.add(room)
        rooms.append(room)
    
    db.session.flush()

    messages = []
    for i, room in enumerate(rooms):
        user = users[i]
        
        participant = ChatParticipant(room_id=room.id, user_id=user.id)
        db.session.add(participant)
        
        sample_messages = [
            {"content": "Hello! I need help with my budget planning.", "role": "user"},
            {"content": "I'd be happy to help you with budget planning! Let me analyze your spending patterns.", "role": "assistant"},
            {"content": "What's the best way to allocate my investment portfolio?", "role": "user"},
            {"content": "For a balanced portfolio, consider diversifying across stocks, bonds, and alternative investments based on your risk tolerance.", "role": "assistant"}
        ]
        
        for j, msg_data in enumerate(sample_messages):
            message = ChatMessage(
                room_id=room.id,
                sender_id=user.id if msg_data["role"] == "user" else 1,
                content=msg_data["content"],
                role=msg_data["role"],
                message_type="text",
                timestamp=datetime.now() - timedelta(minutes=10-j*2)
            )
            db.session.add(message)
            messages.append(message)
    
    print(f"✅ Created {len(rooms)} chat rooms with {len(messages)} messages")
    return rooms, messages

def create_support_data():
    """Create sample support articles and FAQs"""
    articles_data = [
        {
            "title": "Getting Started with EasyFinance",
            "content": "Welcome to EasyFinance! This guide will walk you through the initial setup of your account, including linking your bank accounts and creating your first budget.",
            "category": "Getting Started",
            "tags": "setup, introduction, budget"
        },
        {
            "title": "How to Track Investments",
            "content": "Our platform allows you to track various investments like stocks and cryptocurrencies. To add an investment, go to the 'Wealth' section and click on 'Add Investment'.",
            "category": "Investments",
            "tags": "stocks, crypto, tracking"
        }
    ]
    
    articles = []
    for article_data in articles_data:
        article = SupportArticle(**article_data)
        db.session.add(article)
        articles.append(article)
    
    print(f"✅ Created {len(articles)} support articles")

    faqs_data = [
        {
            "question": "Is my financial data secure?",
            "answer": "Yes, we use bank-level encryption to protect your data. We do not store your bank credentials on our servers.",
            "category": "Security"
        },
        {
            "question": "What is the fee for the Pro plan?",
            "answer": "The Pro plan is $15 per month. It includes advanced features like AI chat support and multi-user teams.",
            "category": "Billing"
        }
    ]

    faqs = []
    for faq_data in faqs_data:
        faq = FAQ(**faq_data)
        db.session.add(faq)
        faqs.append(faq)

    print(f"✅ Created {len(faqs)} FAQs")
    return articles, faqs

def main():
    """Main function to populate database with seed data"""
    app = create_app()
    
    with app.app_context():
        print("🌱 Starting EasyFinance seed data generation...")
        
        print("🗑️  Dropping existing tables...")
        db.drop_all()
        
        print("🏗️  Creating new tables...")
        db.create_all()
        
        users = create_users()
        db.session.commit()
        
        plans, teams, subscriptions = create_teams_and_subscriptions(users)
        db.session.commit()
        
        accounts = create_accounts(users)
        db.session.commit()
        
        transactions = create_transactions(users, accounts)
        db.session.commit()
        
        budgets = create_budgets(users)
        db.session.commit()
        
        investments = create_investments(users, accounts)
        db.session.commit()
        
        goals = create_savings_goals(users)
        db.session.commit()
        
        wallets = create_crypto_wallets(users)
        db.session.commit()
        
        defi_positions = create_defi_positions(users, wallets)
        db.session.commit()
        
        nfts = create_nfts(users, wallets)
        db.session.commit()
        
        notifications = create_notifications(users)
        db.session.commit()
        
        alerts = create_price_alerts(users)
        db.session.commit()
        
        rooms, messages = create_chat_rooms(users)
        db.session.commit()

        articles, faqs = create_support_data()
        db.session.commit()
        
        print("\n🎉 Seed data generation completed successfully!")
        print("\n📊 Summary:")
        print(f"   👥 Users: {len(users)}")
        print(f"   🏢 Teams: {len(teams)}")
        print(f"   💼 Plans: {len(plans)}")
        print(f"   💳 Subscriptions: {len(subscriptions)}")
        print(f"   🏦 Accounts: {len(accounts)}")
        print(f"   💳 Transactions: {len(transactions)}")
        print(f"   📋 Budgets: {len(budgets)}")
        print(f"   📈 Investments: {len(investments)}")
        print(f"   🎯 Savings Goals: {len(goals)}")
        print(f"   🪙 Crypto Wallets: {len(wallets)}")
        print(f"   🌾 DeFi Positions: {len(defi_positions)}")
        print(f"   🖼️  NFTs: {len(nfts)}")
        print(f"   🔔 Notifications: {len(notifications)}")
        print(f"   📊 Price Alerts: {len(alerts)}")
        print(f"   💬 Chat Rooms: {len(rooms)}")
        print(f"   📝 Messages: {len(messages)}")
        print(f"   📖 Support Articles: {len(articles)}")
        print(f"   ❓ FAQs: {len(faqs)}")
        
        print("\n🔑 Test User Credentials:")
        print("   Username: john_doe | Password: password123")
        print("   Username: jane_smith | Password: password123") 
        print("   Username: mike_wilson | Password: password123")
        print("   Username: admin_user | Password: admin123")
        
        print("\n🚀 Ready to test EasyFinance API!")

if __name__ == "__main__":
    main()
