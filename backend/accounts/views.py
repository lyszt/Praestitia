import os
import json
import unidecode
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from email_validator import validate_email, EmailNotValidError
from .models import Group, User
from django_ratelimit.decorators import ratelimit

@csrf_exempt
@ratelimit(key='ip', rate='5/m', method='POST', block=True)
@require_POST
def login_view(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, TypeError):
        return JsonResponse({'status': 400, 'body': 'JSON inválido.'}, status=400)

    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return JsonResponse({'status': 400, 'body': 'Dados inválidos. Campos não podem estar vazios.'}, status=400)

    # Busca do usuário no Banco de Dados 
    user = User.objects.filter(username=username).first()

    # Se o usuário existe E a senha bate com o hash salvo no banco
    if user is not None and user.check_password(password):
        return JsonResponse({
            'status': 200, 
            'username': user.username, 
            'token': os.urandom(16).hex()
        })
    
    return JsonResponse({'status': 401, 'body': 'Credenciais inválidas.'}, status=401)

@csrf_exempt
@ratelimit(key='ip', rate='5/m', method='POST', block=True)
@require_POST
def register_view(request):
    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, TypeError):
        return JsonResponse({'status': 400, 'body': 'JSON inválido.'}, status=400)

    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not all([username, password, email]):
        return JsonResponse({'status': 400, 'body': 'Dados inválidos. Campos não podem estar vazios.'}, status=400)

    if len(password) < 8:
        return JsonResponse({'body': 'A senha deve ter pelo menos 8 caracteres.'}, status=400)

    if len(username) < 3:
        return JsonResponse({'body': 'O nome de usuário deve ter pelo menos 3 caracteres.'}, status=400)

    # Sanitização do username
    username = unidecode.unidecode(username)

    # Validação de email
    try:
        email_info = validate_email(email, check_deliverability=True)
        email = email_info.normalized
    except EmailNotValidError:
        return JsonResponse({'status': 400, 'body': 'Email inválido.'}, status=400)

    # Verifica se usuário já existe
    if User.objects.filter(username=username).exists():
        return JsonResponse({'status': 401, 'body': 'Usuário já existe.'}, status=401)

    try:
        group, _ = Group.objects.get_or_create(name='default')

        # O django cria e já hasheia diretamente a senha
        User.objects.create_user(
            username=username,
            email=email,
            password=password,
            group=group,
        )
        
        return JsonResponse({'status': 200, 'body': 'Usuário criado com sucesso.'}, status=200)

    except IntegrityError:
        return JsonResponse({'status': 401, 'body': 'Erro de integridade (usuário ou email já existe).'}, status=401)
    except Exception:
        return JsonResponse({'status': 500, 'body': 'Erro interno no servidor.'}, status=500)