from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import User

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
    type = models.CharField(max_length=10) 
    
class Availability(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    day = models.CharField(max_length=20)
    time = models.CharField(max_length=20)

class Request(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_requests")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_requests")
    skill = models.CharField(max_length=100, default="General")
    language = models.CharField(max_length=100, default="English")
    status = models.CharField(max_length=20, default="pending")  # pending / accepted / rejected
    created_at = models.DateTimeField(auto_now_add=True)




class ChatRoom(models.Model):
    user1 = models.ForeignKey(User, related_name="chat_user1", on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name="chat_user2", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user1} - {self.user2}"


class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    sender = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,  # ✅ don't delete messages
        null=True,                  # ✅ allow NULL in DB
        blank=True                 # ✅ allow empty in forms
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.text[:20]}"