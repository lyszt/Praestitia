import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from knox.models import AuthToken
from django.utils import timezone
from .models import Concorrente

def authenticate_request(request):
    auth_header = request.headers.get('Authorization')

    if not auth_header or not auth_header.startswith('Bearer '):
        return None

    token = auth_header.split(' ')[1]

    try:
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
def concorrentes_list_view(request):
    user = authenticate_request(request)
    if not user:
        return JsonResponse({'status': 401, 'message': 'Não autenticado.'}, status=401)

    if request.method == 'GET':
        concorrentes = Concorrente.objects.filter(user=user)
        data = []
        for c in concorrentes:
            data.append({
                'id': c.id,
                'nome': c.nome,
                'site': c.site,
                'email': c.email,
                'telefone': c.telefone,
                'endereco': c.endereco,
                'cidade': c.cidade,
                'estado': c.estado,
                'cep': c.cep,
                'cnpj': c.cnpj,
                'responsavel': c.responsavel,
                'pontos_fortes': c.pontos_fortes,
                'pontos_fracos': c.pontos_fracos,
                'observacoes': c.observacoes,
                'data_cadastro': c.data_cadastro.isoformat(),
            })
        return JsonResponse({'status': 200, 'concorrentes': data}, status=200)

    elif request.method == 'POST':
        try:
            body = json.loads(request.body)
        except:
            return JsonResponse({'status': 400, 'message': 'JSON inválido'}, status=400)

        if not body.get('nome'):
            return JsonResponse({'status': 400, 'message': 'Nome é obrigatório'}, status=400)

        concorrente = Concorrente.objects.create(
            user=user,
            nome=body['nome'],
            site=body.get('site'),
            email=body.get('email'),
            telefone=body.get('telefone'),
            endereco=body.get('endereco'),
            cidade=body.get('cidade'),
            estado=body.get('estado'),
            cep=body.get('cep'),
            cnpj=body.get('cnpj'),
            responsavel=body.get('responsavel'),
            pontos_fortes=body.get('pontos_fortes'),
            pontos_fracos=body.get('pontos_fracos'),
            observacoes=body.get('observacoes')
        )

        return JsonResponse({
            'status': 201, 
            'message': 'Concorrente criado',
            'concorrente': {'id': concorrente.id, 'nome': concorrente.nome}
        }, status=201)

@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def concorrente_detail_view(request, concorrente_id):
    user = authenticate_request(request)
    if not user:
        return JsonResponse({'status': 401, 'message': 'Não autenticado.'}, status=401)

    try:
        concorrente = Concorrente.objects.get(id=concorrente_id, user=user)
    except Concorrente.DoesNotExist:
        return JsonResponse({'status': 404, 'message': 'Não encontrado'}, status=404)

    if request.method == 'GET':
        return JsonResponse({
            'status': 200,
            'concorrente': {
                'id': concorrente.id,
                'nome': concorrente.nome,
                'site': concorrente.site,
                'email': concorrente.email,
                'telefone': concorrente.telefone,
                'endereco': concorrente.endereco,
                'cidade': concorrente.cidade,
                'estado': concorrente.estado,
                'cep': concorrente.cep,
                'cnpj': concorrente.cnpj,
                'responsavel': concorrente.responsavel,
                'pontos_fortes': concorrente.pontos_fortes,
                'pontos_fracos': concorrente.pontos_fracos,
                'observacoes': concorrente.observacoes
            }
        })

    elif request.method == 'PUT':
        try:
            body = json.loads(request.body)
        except:
            return JsonResponse({'status': 400, 'message': 'JSON inválido'}, status=400)

        if 'nome' in body: concorrente.nome = body['nome']
        if 'site' in body: concorrente.site = body['site']
        if 'email' in body: concorrente.email = body['email']
        if 'telefone' in body: concorrente.telefone = body['telefone']
        if 'endereco' in body: concorrente.endereco = body['endereco']
        if 'cidade' in body: concorrente.cidade = body['cidade']
        if 'estado' in body: concorrente.estado = body['estado']
        if 'cep' in body: concorrente.cep = body['cep']
        if 'cnpj' in body: concorrente.cnpj = body['cnpj']
        if 'responsavel' in body: concorrente.responsavel = body['responsavel']
        if 'pontos_fortes' in body: concorrente.pontos_fortes = body['pontos_fortes']
        if 'pontos_fracos' in body: concorrente.pontos_fracos = body['pontos_fracos']
        if 'observacoes' in body: concorrente.observacoes = body['observacoes']
        
        concorrente.save()
        return JsonResponse({'status': 200, 'message': 'Atualizado com sucesso'})

    elif request.method == 'DELETE':
        concorrente.delete()
        return JsonResponse({'status': 200, 'message': 'Deletado com sucesso'})
