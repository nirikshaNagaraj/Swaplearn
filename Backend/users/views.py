from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import (
    User, Category, Skill, Language,
    UserSkill, Availability, Request
)

# =====================================================
# USERS LIST
# =====================================================
def users_list(request):
    users = User.objects.all()
    result = []

    for user in users:
        teach = UserSkill.objects.filter(user=user, type="teach")
        learn = UserSkill.objects.filter(user=user, type="learn")

        result.append({
            "user_id": user.id,
            "username": user.username,
            "name": user.name,
            "email": user.email,
            "bio": user.bio,
            "credits": user.credits,
            "views": user.views,
            "teachedCount": user.teachedCount,
            "learnedCount": user.learnedCount,
            "teachSkills": [
                {"skill": x.skill, "language": x.language}
                for x in teach
            ],
            "learnSkills": [
                {"skill": x.skill, "language": x.language}
                for x in learn
            ],
        })

    return JsonResponse(result, safe=False)


# =====================================================
# LOGIN
# =====================================================
@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    body = json.loads(request.body)

    user = User.objects.filter(username=body.get("username")).first()

    if not user or not user.check_password(body.get("password")):
        return JsonResponse({"error": "Invalid credentials"}, status=400)

    teach = UserSkill.objects.filter(user=user, type="teach")
    learn = UserSkill.objects.filter(user=user, type="learn")

    return JsonResponse({
        "user_id": user.id,
        "username": user.username,
        "name": user.name,
        "email": user.email,
        "bio": user.bio,
        "credits": user.credits,
        "views": user.views,
        "teachedCount": user.teachedCount,
        "learnedCount": user.learnedCount,
        "teachSkills": [
            {"skill": x.skill, "language": x.language}
            for x in teach
        ],
        "learnSkills": [
            {"skill": x.skill, "language": x.language}
            for x in learn
        ],
    })


# =====================================================
# REGISTER
# =====================================================
@csrf_exempt
def register_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    body = json.loads(request.body)

    if User.objects.filter(username=body.get("username")).exists():
        return JsonResponse({"error": "Username already exists"}, status=400)

    user = User(
        username=body.get("username"),
        name=body.get("name", ""),
        email=body.get("email", ""),
        teachedCount=0,
        learnedCount=0
    )

    user.set_password(body.get("password"))
    user.save()

    for item in body.get("teachSkills", []):
        UserSkill.objects.create(
            user=user,
            skill=item["skill"],
            language=item["language"],
            type="teach"
        )

    for item in body.get("learnSkills", []):
        UserSkill.objects.create(
            user=user,
            skill=item["skill"],
            language=item["language"],
            type="learn"
        )

    return JsonResponse({"message": "Registered Successfully"})


# =====================================================
# UPDATE PROFILE
# =====================================================
@csrf_exempt
def update_profile(request):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT required"}, status=400)

    body = json.loads(request.body)

    user = User.objects.filter(username=body.get("username")).first()

    if not user:
        return JsonResponse({"error": "User not found"}, status=404)

    user.username = body.get("newUsername", user.username)
    user.name = body.get("name", user.name)
    user.email = body.get("email", user.email)
    user.bio = body.get("bio", user.bio)
    user.save()

    UserSkill.objects.filter(user=user).delete()

    for item in body.get("teachSkills", []):
        UserSkill.objects.create(
            user=user,
            skill=item["skill"],
            language=item["language"],
            type="teach"
        )

    for item in body.get("learnSkills", []):
        UserSkill.objects.create(
            user=user,
            skill=item["skill"],
            language=item["language"],
            type="learn"
        )

    return JsonResponse({"message": "Profile Updated"})


# =====================================================
# METADATA
# =====================================================
def metadata(request):
    categories = Category.objects.all()
    languages = Language.objects.all()

    return JsonResponse({
        "categories": [
            {
                "name": c.name,
                "skills": [s.name for s in Skill.objects.filter(category=c.name)]
            }
            for c in categories
        ],
        "languages": [l.name for l in languages]
    })


# =====================================================
# MATCHES
# =====================================================
def get_matches(request):
    username = request.GET.get("username")
    current = User.objects.filter(username=username).first()

    if not current:
        return JsonResponse([], safe=False)

    learnSkills = list(UserSkill.objects.filter(user=current, type="learn").values_list("skill", flat=True))
    teachSkills = list(UserSkill.objects.filter(user=current, type="teach").values_list("skill", flat=True))

    matches = []

    for user in User.objects.exclude(username=username):
        otherTeach = list(UserSkill.objects.filter(user=user, type="teach").values_list("skill", flat=True))
        otherLearn = list(UserSkill.objects.filter(user=user, type="learn").values_list("skill", flat=True))

        score = sum(1 for s in learnSkills if s in otherTeach)
        score += sum(1 for s in teachSkills if s in otherLearn)

        if score > 0:
            matches.append({
                "username": user.username,
                "name": user.name,
                "credits": user.credits,
                "matchScore": score,
                "teachedCount": user.teachedCount,
                "learnedCount": user.learnedCount
            })

    return JsonResponse(sorted(matches, key=lambda x: x["matchScore"], reverse=True), safe=False)


# =====================================================
# COMPLETE SESSION
# =====================================================
@csrf_exempt
def complete_session(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    body = json.loads(request.body)

    teacher = User.objects.filter(username=body.get("teacher")).first()
    learner = User.objects.filter(username=body.get("learner")).first()

    if not teacher or not learner:
        return JsonResponse({"error": "Users not found"}, status=404)

    teacher.teachedCount += 1
    learner.learnedCount += 1

    teacher.credits += 5
    learner.credits += 2

    teacher.save()
    learner.save()

    return JsonResponse({"message": "Session completed"})


# =====================================================
# AVAILABILITY
# =====================================================
@csrf_exempt
def save_calendar_slots(request):
    body = json.loads(request.body)
    user = User.objects.filter(username=body.get("username")).first()

    if not user:
        return JsonResponse({"error": "User not found"}, status=404)

    Availability.objects.filter(user=user).delete()

    for item in body.get("slots", []):
        if item.get("day") and item.get("time"):
            Availability.objects.create(
                user=user,
                day=item["day"],
                time=item["time"]
            )

    return JsonResponse({"message": "Saved"})


def get_calendar_slots(request):
    user = User.objects.filter(username=request.GET.get("username")).first()

    if not user:
        return JsonResponse([], safe=False)

    data = Availability.objects.filter(user=user)

    result = {}
    for d in data:
        result.setdefault(d.day, []).append(d.time)

    return JsonResponse([
        {"day": k, "slots": v}
        for k, v in result.items()
    ], safe=False)


# =====================================================
# REQUEST SYSTEM
# =====================================================
@csrf_exempt
def send_request(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    body = json.loads(request.body)

    sender = User.objects.filter(id=body.get("sender_id")).first()
    receiver = User.objects.filter(id=body.get("receiver_id")).first()

    if not sender or not receiver:
        return JsonResponse({"error": "User not found"}, status=404)

    req = Request.objects.create(
        sender=sender,
        receiver=receiver,
        skill=body.get("skill", "General"),
        language=body.get("language", "English"),
        status="pending"
    )

    return JsonResponse({"message": "Request sent", "request_id": req.id})


def get_requests(request, user_id):
    user = User.objects.filter(id=user_id).first()

    if not user:
        return JsonResponse([], safe=False)

    reqs = Request.objects.filter(receiver=user, status="pending")

    return JsonResponse([
        {
            "request_id": r.id,
            "sender_name": r.sender.name,
            "skill": r.skill,
            "language": r.language,
            "status": r.status,
        }
        for r in reqs
    ], safe=False)


@csrf_exempt
def accept_request(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    req = Request.objects.filter(id=json.loads(request.body).get("request_id")).first()

    if not req:
        return JsonResponse({"error": "Request not found"}, status=404)

    req.status = "accepted"
    req.save()

    return JsonResponse({"message": "Accepted"})


@csrf_exempt
def reject_request(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    req = Request.objects.filter(id=json.loads(request.body).get("request_id")).first()

    if not req:
        return JsonResponse({"error": "Request not found"}, status=404)

    req.status = "rejected"
    req.save()

    return JsonResponse({"message": "Rejected"})