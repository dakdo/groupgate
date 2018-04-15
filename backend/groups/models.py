from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class Course(models.Model):
    TERM_CHOICES = (
        ('SUMMER', 'Summer'),
        ('FALL', 'Fall'),
        ('SPRING', 'Spring')
    )

    name = models.CharField(max_length=255)
    term = models.CharField(max_length=255, choices=TERM_CHOICES)
    year = models.CharField(max_length=255)
    users = models.ForeignKey('CustomUser', on_delete=models.CASCADE, blank=True, null=True)

class CustomUser(AbstractUser):

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    # @property 
    # def average_rating(self): 
    #     return Rating.objects.filter(user__id=self.id).aggregate(models.Avg('rating'))

    # @property
    # def full_name(self):s
    #     return self.first_name + self.last_name

    groups = models.ManyToManyField('Group', through = 'Membership', blank=True)
    display_name = models.CharField(max_length=255, blank=True)
    about_me = models.TextField(blank=True)
    courses = models.ManyToManyField(Course, blank=True)

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
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True)

    members = models.ManyToManyField(CustomUser, blank=True, related_name='members')
    # course =models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Membership(models.Model):

    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    user_role = models.CharField(max_length=100)
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE, blank=True)

    # def add_membership(user, group, role):

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

class Invite(models.Model):

     from_user=models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="person_inviting")
     to_user=models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="person_invited")
     group=models.ForeignKey(Group, on_delete=models.CASCADE, related_name="group_invite")
     status=models.IntegerField(blank=True, default=0)

     def accept(self):
         self.status=1
         self.save()

     def decline(self):
         self.status=2
         self.save()