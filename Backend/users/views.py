from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import User, Category, Skill, Language, UserSkill


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

    username = body.get("username")
    password = body.get("password")

    user = User.objects.filter(username=username).first()

    if not user:
        return JsonResponse({"error": "Invalid credentials"}, status=400)

    if not user.check_password(password):
        return JsonResponse({"error": "Invalid credentials"}, status=400)

    teach = UserSkill.objects.filter(user=user, type="teach")
    learn = UserSkill.objects.filter(user=user, type="learn")

    return JsonResponse({
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

    username = body.get("username")
    password = body.get("password")
    name = body.get("name", "")
    email = body.get("email", "")

    teachSkills = body.get("teachSkills", [])
    learnSkills = body.get("learnSkills", [])

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already exists"}, status=400)

    user = User(
        username=username,
        name=name,
        email=email,
        teachedCount=0,
        learnedCount=0
    )

    user.set_password(password)
    user.save()

    for item in teachSkills:
        UserSkill.objects.create(
            user=user,
            skill=item["skill"],
            language=item["language"],
            type="teach"
        )

    for item in learnSkills:
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

    username = body.get("username")

    user = User.objects.filter(username=username).first()

    if not user:
        return JsonResponse({"error": "User not found"}, status=404)

    user.name = body.get("name", user.name)
    user.email = body.get("email", user.email)
    user.bio = body.get("bio", user.bio)
    user.save()

    return JsonResponse({"message": "Updated"})


# =====================================================
# METADATA
# =====================================================
def metadata(request):
    categories = Category.objects.all()
    languages = Language.objects.all()

    result = []

    for cat in categories:
        skills = Skill.objects.filter(category=cat.name)

        result.append({
            "name": cat.name,
            "skills": [x.name for x in skills]
        })

    return JsonResponse({
        "categories": result,
        "languages": [x.name for x in languages]
    })


# =====================================================
# MATCHES
# =====================================================
def get_matches(request):
    username = request.GET.get("username")

    current = User.objects.filter(username=username).first()

    if not current:
        return JsonResponse([], safe=False)

    learnSkills = list(
        UserSkill.objects.filter(
            user=current,
            type="learn"
        ).values_list("skill", flat=True)
    )

    teachSkills = list(
        UserSkill.objects.filter(
            user=current,
            type="teach"
        ).values_list("skill", flat=True)
    )

    users = User.objects.exclude(username=username)

    matches = []

    for user in users:
        otherTeach = list(
            UserSkill.objects.filter(
                user=user,
                type="teach"
            ).values_list("skill", flat=True)
        )

        otherLearn = list(
            UserSkill.objects.filter(
                user=user,
                type="learn"
            ).values_list("skill", flat=True)
        )

        score = 0

        for s in learnSkills:
            if s in otherTeach:
                score += 1

        for s in teachSkills:
            if s in otherLearn:
                score += 1

        if score > 0:
            matches.append({
                "username": user.username,
                "name": user.name,
                "credits": user.credits,
                "matchScore": score,
                "teachedCount": user.teachedCount,
                "learnedCount": user.learnedCount
            })

    matches.sort(key=lambda x: x["matchScore"], reverse=True)

    return JsonResponse(matches, safe=False)


# =====================================================
# COMPLETE SESSION
# =====================================================
@csrf_exempt
def complete_session(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    body = json.loads(request.body)

    teacherUsername = body.get("teacher")
    learnerUsername = body.get("learner")

    teacher = User.objects.filter(username=teacherUsername).first()
    learner = User.objects.filter(username=learnerUsername).first()

    if not teacher or not learner:
        return JsonResponse({"error": "Users not found"}, status=404)

    teacher.teachedCount += 1
    learner.learnedCount += 1

    teacher.credits += 5
    learner.credits += 2

    teacher.save()
    learner.save()

    return JsonResponse({"message": "Session completed"})