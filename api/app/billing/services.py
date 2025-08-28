from app.extensions import db
from app.auth.models import Plan, Subscription

class SubscriptionService:
    @staticmethod
    def get_all_plans():
        return Plan.query.all()

    @staticmethod
    def get_subscription_by_team_id(team_id):
        return Subscription.query.filter_by(team_id=team_id).first()

    @staticmethod
    def create_subscription(team_id, plan_id):
        existing_subscription = SubscriptionService.get_subscription_by_team_id(team_id)
        if existing_subscription:
            existing_subscription.plan_id = plan_id
            db.session.commit()
            return existing_subscription

        subscription = Subscription(team_id=team_id, plan_id=plan_id, status='active')
        db.session.add(subscription)
        db.session.commit()
        return subscription

    @staticmethod
    def cancel_subscription(team_id):
        subscription = SubscriptionService.get_subscription_by_team_id(team_id)
        if subscription:
            subscription.status = 'canceled'
            db.session.commit()
            return True
        return False
