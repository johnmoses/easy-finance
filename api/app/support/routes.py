from flask import Blueprint, jsonify
from .models import SupportArticle, FAQ
from .schemas import support_articles_schema, faqs_schema, support_article_schema, faq_schema

support_bp = Blueprint('support_bp', __name__, url_prefix='/support')

@support_bp.route('/articles', methods=['GET'])
def get_articles():
    articles = SupportArticle.query.all()
    return jsonify(support_articles_schema.dump(articles))

@support_bp.route('/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    article = SupportArticle.query.get_or_404(article_id)
    return jsonify(support_article_schema.dump(article))

@support_bp.route('/faqs', methods=['GET'])
def get_faqs():
    faqs = FAQ.query.all()
    return jsonify(faqs_schema.dump(faqs))

@support_bp.route('/faqs/<int:faq_id>', methods=['GET'])
def get_faq(faq_id):
    faq = FAQ.query.get_or_404(faq_id)
    return jsonify(faq_schema.dump(faq))
