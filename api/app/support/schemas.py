from app.extensions import ma

class SupportArticleSchema(ma.Schema):
    class Meta:
        fields = ('id', 'title', 'content', 'category', 'tags', 'created_at', 'updated_at')

class FAQSchema(ma.Schema):
    class Meta:
        fields = ('id', 'question', 'answer', 'category', 'created_at', 'updated_at')

support_article_schema = SupportArticleSchema()
support_articles_schema = SupportArticleSchema(many=True)
faq_schema = FAQSchema()
faqs_schema = FAQSchema(many=True)
