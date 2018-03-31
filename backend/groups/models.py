from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    # @property 
    # def average_rating(self): 
    #     return Rating.objects.filter(user__id=self.id).aggregate(models.Avg('rating'))

    # @property
    # def full_name(self):
    #     return self.first_name + self.last_name

    groups = models.ManyToManyField('Group', through = 'Membership', blank=True)
    display_name = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return self.username

# class Profile(models.Model):
#     user = models.OneToOneField(CustomUser)

#     def __str__(self):
#         return self.user

class Group(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    # owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='owner')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    members = models.ManyToManyField(CustomUser, blank=True, related_name='members')
    course =models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Membership(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    role = models.CharField(max_length=100)


class Rating(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    
    # STAR_CONVERSION = (
    #     (1, 'One'),
    #     (2, 'Two'),
    #     (3, 'Three'),
    #     (4, 'Four'),
    #     (5, 'Five'),
    #     )

    # rating = models.PositiveSmallIntegerField(choices=STAR_CONVERSION)

    rating = models.IntegerField()