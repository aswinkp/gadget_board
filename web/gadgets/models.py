from django.db import models
from django.contrib.postgres.fields import JSONField
from django.template.defaultfilters import slugify
from authentication.models import Account

class Gadget(models.Model):
	name = models.CharField(max_length=40, unique=True)
	slug = models.SlugField(null=True, blank=True)
	description = models.TextField()
	users_can_upload = models.ManyToManyField(Account)
	image_name = models.CharField(max_length=140, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	@property
	def image_url(self):
		return "/static/media/{}".format(self.image_name)
	
	def __str__(self):
		return self.name

	def save(self, *args, **kwargs):
		if not self.id:
			self.slug = slugify(self.name)

		super(Gadget, self).save(*args, **kwargs)


class GadgetData(models.Model):
	gadget = models.ForeignKey(Gadget)
	data = JSONField()
	added_by = models.ForeignKey(Account)
	timestamp = models.DateTimeField()
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return '{} {}'.format(self.added_by, self.timestamp)