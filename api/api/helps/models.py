from django.db import models
from django.template.defaultfilters import slugify

class Category(models.Model):
    name = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    slug = models.SlugField(max_length=55, unique=True)
    pic = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_modified = models.BooleanField(default=False)
    modified_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    restored_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        return super().save(*args, **kwargs)

    class Meta:
        ordering = ('name', )
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

class Help(models.Model):
    title = models.TextField(null=True)
    content = models.TextField(null=True)
    category = models.ForeignKey(
        Category, null=True, related_name='category_helps',
        on_delete=models.CASCADE
    )
    pic = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_modified = models.BooleanField(default=False)
    modified_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    restored_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ('title',)