from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, Skill, Language, UserSkill, Category


# ✅ METADATA
@api_view(['GET'])
def get_metadata(request):
    categories = Category.objects.all()
    skills = Skill.objects.all()
    languages = Language.objects.all()

    data = []

    for cat in categories:
        cat_skills = skills.filter(category=cat.name)
        data.append({
            "name": cat.name,
            "skills": [s.name for s in cat_skills]
        })

    return Response({
        "categories": data,
        "languages": [l.name for l in languages]
    })


# ✅ REGISTER
@api_view(['POST'])
def register(request):
    data = request.data

    user = User(
        username=data['username'],
        name=data.get('name', ''),
        email=data.get('email', '')
    )

    # ✅ HASH PASSWORD
    user.set_password(data['password'])
    user.save()

    # SAVE SKILLS
    for item in data.get('teachSkills', []):
        UserSkill.objects.create(
            user=user,
            skill=item['skill'],
            language=item['language'],
            type='teach'
        )

    for item in data.get('learnSkills', []):
        UserSkill.objects.create(
            user=user,
            skill=item['skill'],
            language=item['language'],
            type='learn'
        )

    return Response({"message": "User created"})


@api_view(['POST'])
def login_user(request):
    data = request.data

    try:
        user = User.objects.get(username=data['username'])

        # ✅ CHECK HASHED PASSWORD
        if not user.check_password(data['password']):
            return Response({"error": "Invalid credentials"}, status=400)

        skills = UserSkill.objects.filter(user=user)

        teachSkills = []
        learnSkills = []

        for s in skills:
            skill_data = {
                "skill": s.skill,
                "language": s.language
            }

            if s.type == 'teach':
                teachSkills.append(skill_data)
            else:
                learnSkills.append(skill_data)

        return Response({
            "username": user.username,
            "name": user.name,
            "email": user.email,
            "teachSkills": teachSkills,
            "learnSkills": learnSkills
        })

    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=400)
    
@api_view(['GET'])
def get_users(request):
    users = User.objects.all()

    result = []

    for user in users:
        skills = UserSkill.objects.filter(user=user)

        teachSkills = []
        learnSkills = []

        for s in skills:
            skill_data = {
                "skill": s.skill,
                "language": s.language
            }

            if s.type == 'teach':
                teachSkills.append(skill_data)
            else:
                learnSkills.append(skill_data)

        result.append({
            "username": user.username,
            "name": user.name,
            "teachSkills": teachSkills,
            "learnSkills": learnSkills
        })

    return Response(result)


@api_view(['PUT'])
def update_profile(request):
    data = request.data

    try:
        user = User.objects.get(username=data['username'])

        # UPDATE BASIC INFO
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)

        # OPTIONAL PASSWORD CHANGE
        if data.get('password'):
            user.set_password(data['password'])

        user.save()

        # DELETE OLD SKILLS
        UserSkill.objects.filter(user=user).delete()

        # SAVE NEW TEACH SKILLS
        for item in data.get('teachSkills', []):
            UserSkill.objects.create(
                user=user,
                skill=item['skill'],
                language=item['language'],
                type='teach'
            )

        # SAVE NEW LEARN SKILLS
        for item in data.get('learnSkills', []):
            UserSkill.objects.create(
                user=user,
                skill=item['skill'],
                language=item['language'],
                type='learn'
            )

        return Response({"message": "Profile updated ✅"})

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=400)