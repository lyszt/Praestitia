import json
import unidecode
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.utils import timezone
from email_validator import validate_email, EmailNotValidError
from knox.models import AuthToken
from .models import Group, User
from django_ratelimit.decorators import ratelimit
from knox.crypto import hash_token
from knox.auth import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.http import require_http_methods


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
        _, token = AuthToken.objects.create(user)
        return JsonResponse({
            'status': 200, 
            'username': user.username, 
            'token': token
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
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            group=group,
        )
        
        # Cria token para login automático após registro
        _, token = AuthToken.objects.create(user)
        
        return JsonResponse({
            'status': 200, 
            'body': 'Usuário criado com sucesso.',
            'token': token
        }, status=200)

    except IntegrityError:
        return JsonResponse({'status': 401, 'body': 'Erro de integridade (usuário ou email já existe).'}, status=401)
    except Exception:
        return JsonResponse({'status': 500, 'body': 'Erro interno no servidor.'}, status=500)



@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def validate_token_view(request):
    """Valida o token de autenticação usando Knox TokenAuthentication."""
    user = request.user
    return Response({
        'status': 200,
        'valid': True,
        'username': user.username,
        'email': user.email,
        'group': user.group.name if user.group else None,
        'permissions': user.group.permissions if user.group else []
    })


def authenticate_request(request):
    auth_header = request.headers.get('Authorization')

    if not auth_header or not auth_header.startswith('Token '):
        return None

    token = auth_header.split(' ')[1]

    try:
        auth_token = AuthToken.objects.select_related('user').filter(
            token_key=token[:8]
        ).first()

        if not auth_token:
            return None

        if auth_token.expiry and auth_token.expiry < timezone.now():
            return None

        return auth_token.user
    except Exception:
        return None


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def users_list_view(request):
    user = request.user

    if not user.group or 1 not in user.group.permissions:
        return JsonResponse({'status': 403, 'message': 'Sem permissão.'}, status=403)

    if request.method == 'GET':
        users = User.objects.select_related('group').all()
        users_data = []

        for u in users:
            users_data.append({
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'group': u.group.name if u.group else None,
                'group_id': u.group.id if u.group else None,
            })

        return JsonResponse({'status': 200, 'users': users_data}, status=200)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
        except (json.JSONDecodeError, TypeError):
            return JsonResponse({'status': 400, 'message': 'JSON inválido.'}, status=400)

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        group_id = data.get('group_id')

        if not all([username, email, password]):
            return JsonResponse({'status': 400, 'message': 'Username, email e password são obrigatórios.'}, status=400)

        try:
            email_info = validate_email(email, check_deliverability=False)
            email = email_info.normalized

            group = None
            if group_id:
                try:
                    group = Group.objects.get(id=group_id)
                except Group.DoesNotExist:
                    return JsonResponse({'status': 400, 'message': 'Grupo não encontrado.'}, status=400)

            new_user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                group=group
            )

            return JsonResponse({
                'status': 201,
                'message': 'Usuário criado com sucesso.',
                'user': {
                    'id': new_user.id,
                    'username': new_user.username,
                    'email': new_user.email,
                }
            }, status=201)

        except IntegrityError:
            return JsonResponse({'status': 400, 'message': 'Username ou email já existe.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 500, 'message': f'Erro ao criar usuário: {str(e)}'}, status=500)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_detail_view(request, user_id):
    user = request.user

    if not user.group or 1 not in user.group.permissions:
        return JsonResponse({'status': 403, 'message': 'Sem permissão.'}, status=403)

    try:
        target_user = User.objects.select_related('group').get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'status': 404, 'message': 'Usuário não encontrado.'}, status=404)

    if request.method == 'GET':
        user_data = {
            'id': target_user.id,
            'username': target_user.username,
            'email': target_user.email,
            'group': target_user.group.name if target_user.group else None,
            'group_id': target_user.group.id if target_user.group else None,
        }
        return JsonResponse({'status': 200, 'user': user_data}, status=200)

    elif request.method in ['PUT', 'PATCH']:
        try:
            data = json.loads(request.body)
        except (json.JSONDecodeError, TypeError):
            return JsonResponse({'status': 400, 'message': 'JSON inválido.'}, status=400)

        if 'username' in data:
            target_user.username = data['username']
        if 'email' in data:
            try:
                email_info = validate_email(data['email'], check_deliverability=False)
                target_user.email = email_info.normalized
            except EmailNotValidError:
                return JsonResponse({'status': 400, 'message': 'Email inválido.'}, status=400)
        if 'password' in data:
            target_user.set_password(data['password'])
        if 'group_id' in data:
            if data['group_id']:
                try:
                    group = Group.objects.get(id=data['group_id'])
                    target_user.group = group
                except Group.DoesNotExist:
                    return JsonResponse({'status': 400, 'message': 'Grupo não encontrado.'}, status=400)
            else:
                target_user.group = None

        try:
            target_user.save()
            return JsonResponse({
                'status': 200,
                'message': 'Usuário atualizado com sucesso.',
                'user': {
                    'id': target_user.id,
                    'username': target_user.username,
                    'email': target_user.email,
                }
            }, status=200)
        except IntegrityError:
            return JsonResponse({'status': 400, 'message': 'Username ou email já existe.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 500, 'message': f'Erro ao atualizar usuário: {str(e)}'}, status=500)

    elif request.method == 'DELETE':
        if target_user.id == user.id:
            return JsonResponse({'status': 400, 'message': 'Não pode deletar sua própria conta.'}, status=400)

        try:
            target_user.delete()
            return JsonResponse({'status': 200, 'message': 'Usuário deletado com sucesso.'}, status=200)
        except Exception as e:
            return JsonResponse({'status': 500, 'message': f'Erro ao deletar usuário: {str(e)}'}, status=500)