import os
import unidecode
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, get_user_model
from .models import Group
from django.db import IntegrityError
from email_validator import validate_email, EmailNotValidError

User = get_user_model()


def json_request_data(request):
    try:
        return request.json if hasattr(request, 'json') else request.POST or request.body and request.body.decode() and request.POST
    except Exception:
        import json
        try:
            return json.loads(request.body.decode()) if request.body else {}
        except Exception:
            return {}


@csrf_exempt
@require_POST
def login_view(request):
    data = json_request_data(request)
    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return JsonResponse({'status': 400, 'body': 'Dados inválidos. Campos não podem estar vazios.'}, status=400)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        return JsonResponse({'status': 200, 'username': username, 'token': os.urandom(16).hex()})
    return JsonResponse({'status': 401}, status=401)


@csrf_exempt
@require_POST
def register_view(request):
    data = json_request_data(request)
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not all([username, password, email]):
        return JsonResponse({'status': 400, 'body': 'Dados inválidos. Campos não podem estar vazios.'}, status=400)

    if len(password) < 8:
        return JsonResponse({'body': 'A senha deve ter pelo menos 8 caracteres.'}, status=400)

    if len(username) < 3:
        return JsonResponse({'body': 'O nome de usuário deve ter pelo menos 3 caracteres.'}, status=400)

    username = unidecode.unidecode(username)

    try:
        email_info = validate_email(email, check_deliverability=True)
        email = email_info.normalized
    except EmailNotValidError:
        return JsonResponse({'status': 400, 'body': 'Dados inválidos. Email inválido.'}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({'status': 401, 'body': 'Usuário já existe.'}, status=401)

    try:
        # Cria usuário e associa ao grupo default 
        group, _ = Group.objects.get_or_create(name='default')
        user = User.objects.create_user(username=username, email=email, password=password, group=group)
        return JsonResponse({'status': 200}, status=200)
    except IntegrityError:
        return JsonResponse({'status': 401, 'body': 'Usuário já existe.'}, status=401)
    except Exception:
        return JsonResponse({'status': 500}, status=500)
