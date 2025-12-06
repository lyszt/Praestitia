import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from knox.models import AuthToken
from django.utils import timezone
from .models import Cliente


def authenticate_request(request):
    """Helper function to authenticate requests using Bearer tokens."""
    auth_header = request.headers.get('Authorization')

    if not auth_header or not auth_header.startswith('Bearer '):
        return None

    token = auth_header.split(' ')[1]

    try:
        # O token gerado tem mais de 15 caracteres então foi necessario por :8
        auth_token = AuthToken.objects.select_related('user').filter(
            token_key__startswith=token[:8]
        ).first()

        if not auth_token:
            return None

        if auth_token.expiry and auth_token.expiry < timezone.now():
            return None

        return auth_token.user
    except Exception:
        return None


@csrf_exempt
@require_http_methods(["GET", "POST"])
def clientes_list_view(request):
    """
    GET: List all clientes
    POST: Create a new cliente
    """
    # Authenticate user
    user = authenticate_request(request)
    if not user:
        return JsonResponse({'status': 401, 'message': 'Não autenticado.'}, status=401)

    if request.method == 'GET':
        clientes = Cliente.objects.all()
        clientes_data = []

        for cliente in clientes:
            clientes_data.append({
                'id': cliente.id,
                'nome': cliente.nome,
                'email': cliente.email,
                'telefone': cliente.telefone,
                'empresa': cliente.empresa,
                'status': cliente.status,
                'endereco': cliente.endereco,
                'cnpj_cpf': cliente.cnpj_cpf,
                'observacoes': cliente.observacoes,
                'data_cadastro': cliente.data_cadastro.isoformat() if cliente.data_cadastro else None,
                'data_atualizacao': cliente.data_atualizacao.isoformat() if cliente.data_atualizacao else None,
            })

        return JsonResponse({'status': 200, 'clientes': clientes_data}, status=200)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
        except (json.JSONDecodeError, TypeError):
            return JsonResponse({'status': 400, 'message': 'JSON inválido.'}, status=400)

        # Validate required fields
        nome = data.get('nome')
        email = data.get('email')

        if not all([nome, email]):
            return JsonResponse({'status': 400, 'message': 'Nome e email são obrigatórios.'}, status=400)

        try:
            cliente = Cliente.objects.create(
                nome=nome,
                email=email,
                telefone=data.get('telefone'),
                empresa=data.get('empresa'),
                status=data.get('status', 'ativo'),
                endereco=data.get('endereco'),
                cnpj_cpf=data.get('cpf_cnpj'),
                observacoes=data.get('observacoes'),
            )

            return JsonResponse({
                'status': 201,
                'message': 'Cliente criado com sucesso.',
                'cliente': {
                    'id': cliente.id,
                    'nome': cliente.nome,
                    'email': cliente.email,
                }
            }, status=201)

        except Exception as e:
            return JsonResponse({'status': 500, 'message': f'Erro ao criar cliente: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def cliente_detail_view(request, cliente_id):
    """
    GET: Retrieve a specific cliente
    PUT/PATCH: Update a specific cliente
    DELETE: Delete a specific cliente
    """
    # Authenticate user
    user = authenticate_request(request)
    if not user:
        return JsonResponse({'status': 401, 'message': 'Não autenticado.'}, status=401)

    # Get cliente or return 404
    try:
        cliente = Cliente.objects.get(id=cliente_id)
    except Cliente.DoesNotExist:
        return JsonResponse({'status': 404, 'message': 'Cliente não encontrado.'}, status=404)

    if request.method == 'GET':
        cliente_data = {
            'id': cliente.id,
            'nome': cliente.nome,
            'email': cliente.email,
            'telefone': cliente.telefone,
            'empresa': cliente.empresa,
            'status': cliente.status,
            'endereco': cliente.endereco,
            'cnpj_cpf': cliente.cnpj_cpf,
            'observacoes': cliente.observacoes,
            'data_cadastro': cliente.data_cadastro.isoformat() if cliente.data_cadastro else None,
            'data_atualizacao': cliente.data_atualizacao.isoformat() if cliente.data_atualizacao else None,
        }

        return JsonResponse({'status': 200, 'cliente': cliente_data}, status=200)

    elif request.method in ['PUT', 'PATCH']:
        try:
            data = json.loads(request.body)
        except (json.JSONDecodeError, TypeError):
            return JsonResponse({'status': 400, 'message': 'JSON inválido.'}, status=400)

        # Update fields if provided
        if 'nome' in data:
            cliente.nome = data['nome']
        if 'email' in data:
            cliente.email = data['email']
        if 'telefone' in data:
            cliente.telefone = data['telefone']
        if 'empresa' in data:
            cliente.empresa = data['empresa']
        if 'status' in data:
            cliente.status = data['status']
        if 'endereco' in data:
            cliente.endereco = data['endereco']
        if 'cpf_cnpj' in data:
            cliente.cnpj_cpf = data['cpf_cnpj']
        if 'observacoes' in data:
            cliente.observacoes = data['observacoes']

        try:
            cliente.save()
            return JsonResponse({
                'status': 200,
                'message': 'Cliente atualizado com sucesso.',
                'cliente': {
                    'id': cliente.id,
                    'nome': cliente.nome,
                    'email': cliente.email,
                }
            }, status=200)
        except Exception as e:
            return JsonResponse({'status': 500, 'message': f'Erro ao atualizar cliente: {str(e)}'}, status=500)

    elif request.method == 'DELETE':
        try:
            cliente.delete()
            return JsonResponse({'status': 200, 'message': 'Cliente deletado com sucesso.'}, status=200)
        except Exception as e:
            return JsonResponse({'status': 500, 'message': f'Erro ao deletar cliente: {str(e)}'}, status=500)
