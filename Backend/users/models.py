from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=255)

    name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    bio = models.TextField(blank=True, default="")

    credits = models.IntegerField(default=10)
    views = models.IntegerField(default=0)

    # REAL COUNTS
    teachedCount = models.IntegerField(default=0)
    learnedCount = models.IntegerField(default=0)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)


class Category(models.Model):
    name = models.CharField(max_length=100)


class Skill(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)


class Language(models.Model):
    name = models.CharField(max_length=100)


class UserSkill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    skill = models.CharField(max_length=100)
    language = models.CharField(max_length=100)
    type = models.CharField(max_length=10)   # teach / learn