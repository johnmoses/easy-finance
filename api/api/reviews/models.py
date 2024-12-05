from django.db import models
from django.conf import settings


class Review(models.Model):
    content = models.TextField(blank=True, null=True)
    rating = models.DecimalField(max_digits=5, decimal_places=2)
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='reviewer_reviews',
        on_delete=models.CASCADE
    )
    item_id = models.CharField(max_length=50, null=True)
    item_type = models.CharField(max_length=50, null=True)
    is_flagged = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    is_modified = models.BooleanField(default=False)
    modified_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    restored_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ('created_at',)

