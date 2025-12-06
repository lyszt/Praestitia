import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from knox.models import AuthToken
from django.utils import timezone
from .models import Lead


def authenticate_request(request):
    """Helper function to authenticate requests using Bearer tokens."""
    auth_header = request.headers.get('Authorization')

    print(f"[DEBUG] Auth header: {auth_header}")

    if not auth_header or not auth_header.startswith('Bearer '):
        print(f"[DEBUG] No valid Bearer token in header")
        return None

    token = auth_header.split(' ')[1]
    print(f"[DEBUG] Full token: {token}")
    print(f"[DEBUG] Token key (first 8): {token[:8]}")

    try:
        # Knox stores token_key (it's longer than 8 chars - typically 15)
        # Try to match by the token prefix stored in token_key field
        from knox.crypto import hash_token

        # Knox uses SHA512 hash, but stores a prefix in token_key
        # The token_key field contains the first part of the token
        auth_token = AuthToken.objects.select_related('user').filter(
            token_key__startswith=token[:8]
        ).first()

        if not auth_token:
            print(f"[DEBUG] Token not found in database")
            return None

        print(f"[DEBUG] Token found for user: {auth_token.user.username}")

        # Check if token has expired
        if auth_token.expiry and auth_token.expiry < timezone.now():
            print(f"[DEBUG] Token expired")
            return None

        print(f"[DEBUG] Authentication successful")
        return auth_token.user
    except AuthToken.DoesNotExist:
        print(f"[DEBUG] Token not found in database")
        return None
    except Exception as e:
        print(f"[DEBUG] Exception during auth: {e}")
        return None


@csrf_exempt
@require_http_methods(["GET", "POST"])
def leads_list_view(request):
    """
    GET: List all leads
    POST: Create a new lead
    """
    # Authenticate user
    user = authenticate_request(request)
    if not user:
        return JsonResponse({'status': 401, 'message': 'Não autenticado.'}, status=401)

    if request.method == 'GET':
        leads = Lead.objects.all()
        leads_data = []

        for lead in leads:
            leads_data.append({
                'id': lead.id,
                'nome': lead.nome,
                'email': lead.email,
                'telefone': lead.telefone,
                'origem': lead.origem,
                'interesse': lead.interesse,
                'status': lead.status,
                'empresa': lead.empresa,
                'cargo': lead.cargo,
                'observacoes': lead.observacoes,
                'pontuacao': lead.pontuacao,
                'data_cadastro': lead.data_cadastro.isoformat() if lead.data_cadastro else None,
                'data_atualizacao': lead.data_atualizacao.isoformat() if lead.data_atualizacao else None,
                'data_ultimo_contato': lead.data_ultimo_contato.isoformat() if lead.data_ultimo_contato else None,
            })

        return JsonResponse({'status': 200, 'leads': leads_data}, status=200)

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
            lead = Lead.objects.create(
                nome=nome,
                email=email,
                telefone=data.get('telefone'),
                origem=data.get('origem', 'site'),
                interesse=data.get('interesse'),
                status=data.get('status', 'novo'),
                empresa=data.get('empresa'),
                cargo=data.get('cargo'),
                observacoes=data.get('observacoes'),
                pontuacao=data.get('pontuacao', 0),
            )

            return JsonResponse({
                'status': 201,
                'message': 'Lead criado com sucesso.',
                'lead': {
                    'id': lead.id,
                    'nome': lead.nome,
                    'email': lead.email,
                }
            }, status=201)

        except Exception as e:
            return JsonResponse({'status': 500, 'message': f'Erro ao criar lead: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["GET", "PUT", "PATCH", "DELETE"])
def lead_detail_view(request, lead_id):
    """
    GET: Retrieve a specific lead
    PUT/PATCH: Update a specific lead
    DELETE: Delete a specific lead
    """
    # Authenticate user
    user = authenticate_request(request)
    if not user:
        return JsonResponse({'status': 401, 'message': 'Não autenticado.'}, status=401)

    # Get lead or return 404
    try:
        lead = Lead.objects.get(id=lead_id)
    except Lead.DoesNotExist:
        return JsonResponse({'status': 404, 'message': 'Lead não encontrado.'}, status=404)

    if request.method == 'GET':
        lead_data = {
            'id': lead.id,
            'nome': lead.nome,
            'email': lead.email,
            'telefone': lead.telefone,
            'origem': lead.origem,
            'interesse': lead.interesse,
            'status': lead.status,
            'empresa': lead.empresa,
            'cargo': lead.cargo,
            'observacoes': lead.observacoes,
            'pontuacao': lead.pontuacao,
            'data_cadastro': lead.data_cadastro.isoformat() if lead.data_cadastro else None,
            'data_atualizacao': lead.data_atualizacao.isoformat() if lead.data_atualizacao else None,
            'data_ultimo_contato': lead.data_ultimo_contato.isoformat() if lead.data_ultimo_contato else None,
        }

        return JsonResponse({'status': 200, 'lead': lead_data}, status=200)

    elif request.method in ['PUT', 'PATCH']:
        try:
            data = json.loads(request.body)
        except (json.JSONDecodeError, TypeError):
            return JsonResponse({'status': 400, 'message': 'JSON inválido.'}, status=400)

        # Update fields if provided
        if 'nome' in data:
            lead.nome = data['nome']
        if 'email' in data:
            lead.email = data['email']
        if 'telefone' in data:
            lead.telefone = data['telefone']
        if 'origem' in data:
            lead.origem = data['origem']
        if 'interesse' in data:
            lead.interesse = data['interesse']
        if 'status' in data:
            lead.status = data['status']
        if 'empresa' in data:
            lead.empresa = data['empresa']
        if 'cargo' in data:
            lead.cargo = data['cargo']
        if 'observacoes' in data:
            lead.observacoes = data['observacoes']
        if 'pontuacao' in data:
            lead.pontuacao = data['pontuacao']

        try:
            lead.save()
            return JsonResponse({
                'status': 200,
                'message': 'Lead atualizado com sucesso.',
                'lead': {
                    'id': lead.id,
                    'nome': lead.nome,
                    'email': lead.email,
                }
            }, status=200)
        except Exception as e:
            return JsonResponse({'status': 500, 'message': f'Erro ao atualizar lead: {str(e)}'}, status=500)

    elif request.method == 'DELETE':
        try:
            lead.delete()
            return JsonResponse({'status': 200, 'message': 'Lead deletado com sucesso.'}, status=200)
        except Exception as e:
            return JsonResponse({'status': 500, 'message': f'Erro ao deletar lead: {str(e)}'}, status=500)
