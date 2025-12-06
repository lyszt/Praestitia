import random
from django.core.management.base import BaseCommand
from leads.models import Lead
from clientes.models import Cliente


class Command(BaseCommand):
    help = 'Gera dados de teste absurdos e engraçados para Leads e Clientes'

    # Nomes ridículos em português
    NOMES = [
        'Zé das Couves', 'Maria do Bairro', 'João Sem Braço', 'Cleiton Rasta',
        'Jéssica da Silva Sauro', 'Wellington Paraíba', 'Creuza Turbinada',
        'Edinaldo Pereira', 'Jailson Mendes', 'Dona Florinda Chaves',
        'Seu Madruga Tavares', 'Kiko Barriga', 'Chiquinha da Silva',
        'Professor Girafales', 'Bruxa do 71', 'Dona Neves Geladas',
        'Pópis da Esquina', 'Quico Chiclete', 'Nhonho Gordão',
        'Godinez Trabalhador', 'Chaves Barrel', 'Paty Patricinha',
        'Glória Gorduchinha', 'Clóvis Aparecido', 'Valdirene Souza',
        'Wanderley Cardoso', 'Cleberson Santos', 'Maicon Douglas',
        'Ednaldo Pereira Show', 'Gerson Combustível', 'Anderson Silva Lutador',
        'Roberta Baianinha', 'Josué Barbudo', 'Sebastião Salgado Temperado'
    ]

    SOBRENOMES = [
        'da Silva', 'dos Santos', 'Oliveira', 'Souza', 'Pereira',
        'Ferreira', 'Costa', 'Rodrigues', 'Alves', 'Nascimento',
        'Lima', 'Araújo', 'Fernandes', 'Carvalho', 'Gomes',
        'Martins', 'Rocha', 'Ribeiro', 'Almeida', 'Monteiro',
        'do Acre', 'de Sergipe', 'Bahiano', 'Carioca', 'Mineiro'
    ]

    # Empresas absurdas
    EMPRESAS = [
        'Bar do Zé LTDA', 'Pastelaria Flor de Lis ME',
        'Churrasquinho do Gordo', 'Brechó da Tia Neuza',
        'Oficina do Manoel Consertos Gerais', 'Salão da Dona Maria Beleza Total',
        'Quitanda do Seu João', 'Mercadinho Preço Bom',
        'Pizzaria Forno a Lenha do Italiano', 'Açougue Carne de Sol',
        'Padaria Pão Quente 24h', 'Lanchonete Big Burguer',
        'Depósito de Bebidas Gelada Boa', 'Auto Peças Rapidão',
        'Farmácia Remédio Certo', 'Pet Shop Cachorro Feliz',
        'Lavanderia Lava Bem', 'Xerox Copia Tudo',
        'Sorveteria Delícia Gelada', 'Tabacaria Fumaça Boa'
    ]

    # Cargos engraçados
    CARGOS = [
        'Gerente de Boteco', 'Coordenador de Esquina',
        'Especialista em Churras', 'Analista de Fofoca',
        'Diretor de Resenha', 'Supervisor de Pelada',
        'Consultor de Pagode', 'Técnico em Gambiarra',
        'Engenheiro de Churrasqueira', 'Arquiteto de Puxadinho',
        'Designer de Xerox', 'Programador de Excel',
        'CEO do Buteco', 'CTO da Lan House',
        'Estagiário Eterno', 'Trainee de Cafézinho'
    ]

    # Interesses ridículos
    INTERESSES = [
        'Curso de Como Enrolar no Trabalho',
        'Ebook: 101 Desculpas para Faltar',
        'Treinamento: Fofoca Corporativa Avançada',
        'Workshop: Como Fingir que Trabalha',
        'Consultoria: Esquema de Pirâmide Financeira',
        'Palestra: Sucesso Sem Fazer Nada',
        'Mentoria: Como Ser Chefe Sem Saber Nada',
        'Software: Gerador de Ata de Reunião Automático',
        'Planilha: Controle de Peladas do Mês',
        'Sistema: Rastreador de Delivery'
    ]

    def add_arguments(self, parser):
        parser.add_argument(
            '--leads',
            type=int,
            default=20,
            help='Número de leads para gerar'
        )
        parser.add_argument(
            '--clientes',
            type=int,
            default=15,
            help='Número de clientes para gerar'
        )
        parser.add_argument(
            '--limpar',
            action='store_true',
            help='Limpar dados existentes antes de gerar novos'
        )

    def gerar_nome_completo(self):
        """Gera um nome completo engraçado"""
        if random.random() < 0.3:
            return random.choice(self.NOMES)
        else:
            nome = random.choice(self.NOMES).split()[0]
            sobrenome = random.choice(self.SOBRENOMES)
            return f"{nome} {sobrenome}"

    def gerar_email(self, nome):
        """Gera um email ridículo baseado no nome"""
        dominios = [
            'hotmail.com.br', 'gmail.com', 'yahoo.com.br', 'bol.com.br',
            'uol.com.br', 'ig.com.br', 'terra.com.br', 'globo.com'
        ]

        # Remove acentos e espaços
        nome_limpo = nome.lower()
        nome_limpo = nome_limpo.replace(' ', '_')
        nome_limpo = nome_limpo.replace('ã', 'a').replace('õ', 'o')
        nome_limpo = nome_limpo.replace('á', 'a').replace('é', 'e')
        nome_limpo = nome_limpo.replace('í', 'i').replace('ó', 'o').replace('ú', 'u')

        sufixos = ['', str(random.randint(1, 999)), '_top', '_oficial', '123', '_real']

        return f"{nome_limpo}{random.choice(sufixos)}@{random.choice(dominios)}"

    def gerar_telefone(self):
        """Gera um telefone brasileiro"""
        ddd = random.choice(['11', '21', '31', '41', '51', '61', '71', '81', '85', '91'])
        numero = f"9{random.randint(1000, 9999)}{random.randint(1000, 9999)}"
        return f"({ddd}) {numero[:5]}-{numero[5:]}"

    def handle(self, *args, **options):
        num_leads = options['leads']
        num_clientes = options['clientes']

        if options['limpar']:
            self.stdout.write(self.style.WARNING('Limpando dados existentes...'))
            Lead.objects.all().delete()
            Cliente.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Dados limpos!'))

        # Gerar Leads
        self.stdout.write(self.style.SUCCESS(f'\nGerando {num_leads} leads absurdos...'))

        leads_criados = 0
        for i in range(num_leads):
            nome = self.gerar_nome_completo()
            email = self.gerar_email(nome)

            try:
                Lead.objects.create(
                    nome=nome,
                    email=email,
                    telefone=self.gerar_telefone(),
                    origem=random.choice(['site', 'indicacao', 'redes_sociais', 'email', 'telefone', 'evento', 'outro']),
                    interesse=random.choice(self.INTERESSES),
                    status=random.choice(['novo', 'contatado', 'qualificado', 'em_negociacao', 'convertido', 'perdido']),
                    empresa=random.choice(self.EMPRESAS),
                    cargo=random.choice(self.CARGOS),
                    observacoes=f"Lead gerado automaticamente. {random.choice(['Muito doido', 'Meio maluco', 'Totalmente pirado', 'Completamente biruta'])}",
                    pontuacao=random.randint(0, 100)
                )
                leads_criados += 1
                self.stdout.write(self.style.SUCCESS(f'  ✓ Lead criado: {nome}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  ✗ Erro ao criar lead {nome}: {e}'))

        # Gerar Clientes
        self.stdout.write(self.style.SUCCESS(f'\nGerando {num_clientes} clientes malucos...'))

        clientes_criados = 0
        for i in range(num_clientes):
            nome = self.gerar_nome_completo()
            email = self.gerar_email(nome)

            try:
                Cliente.objects.create(
                    nome=nome,
                    email=email,
                    telefone=self.gerar_telefone(),
                    empresa=random.choice(self.EMPRESAS),
                    status=random.choice(['ativo', 'inativo', 'pendente', 'suspenso']),
                    endereco=f"Rua {random.choice(['das Flores', 'dos Bobos', 'da Amargura', 'Sem Fim'])}, {random.randint(1, 999)}",
                    cnpj_cpf=f"{random.randint(100, 999)}.{random.randint(100, 999)}.{random.randint(100, 999)}-{random.randint(10, 99)}",
                    observacoes=f"Cliente gerado automaticamente. {random.choice(['Paga em dia', 'Sempre atrasado', 'Negocia muito', 'Cliente top'])}",
                )
                clientes_criados += 1
                self.stdout.write(self.style.SUCCESS(f'  ✓ Cliente criado: {nome}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  ✗ Erro ao criar cliente {nome}: {e}'))

        # Resumo
        self.stdout.write(self.style.SUCCESS('\n' + '='*50))
        self.stdout.write(self.style.SUCCESS(f'Resumo da Geração:'))
        self.stdout.write(self.style.SUCCESS(f'  • Leads criados: {leads_criados}/{num_leads}'))
        self.stdout.write(self.style.SUCCESS(f'  • Clientes criados: {clientes_criados}/{num_clientes}'))
        self.stdout.write(self.style.SUCCESS('='*50))
        self.stdout.write(self.style.SUCCESS('\n🎉 Dados de teste gerados com sucesso!'))
