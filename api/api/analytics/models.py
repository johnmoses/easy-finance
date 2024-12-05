from django.db import models


class Analytic(models.Model):
    anonymous_id = models.CharField(max_length=50, null=True)
    user_id = models.CharField(max_length=50, null=True)
    user_traits = models.TextField(null=True)
    path = models.CharField(max_length=100,  null=True)
    url = models.CharField(max_length=100,  null=True)
    channel = models.CharField(max_length=50,  null=True)
    event = models.CharField(max_length=50,  null=True)
    event_items = models.TextField(null=True)
    created_at = models.DateTimeField(null=True,blank=True)

    def __str__(self):
        return self.path
    
    class Meta:
        ordering = ('created_at',)
