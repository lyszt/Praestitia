from django.db import models
from django.core.validators import EmailValidator, RegexValidator

# Create your models here.

class Lead(models.Model):
    """
    Modelo para gerenciar leads em prospecção.
    Representa potenciais clientes que ainda não converteram.
    """
    
    STATUS_CHOICES = [
        ('novo', 'Novo'),
        ('contatado', 'Contatado'),
        ('qualificado', 'Qualificado'),
        ('em_negociacao', 'Em Negociação'),
        ('convertido', 'Convertido'),
        ('perdido', 'Perdido'),
    ]
    
    ORIGEM_CHOICES = [
        ('site', 'Site'),
        ('indicacao', 'Indicação'),
        ('redes_sociais', 'Redes Sociais'),
        ('email', 'E-mail Marketing'),
        ('telefone', 'Telefone'),
        ('evento', 'Evento'),
        ('outro', 'Outro'),
    ]
    
    # Campos básicos
    nome = models.CharField(
        max_length=200,
        verbose_name='Nome do Lead',
        help_text='Nome completo do lead'
    )
    
    email = models.EmailField(
        max_length=254,
        validators=[EmailValidator()],
        verbose_name='E-mail',
        help_text='E-mail de contato do lead'
    )
    
    telefone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message='Número de telefone deve estar no formato: "+999999999". Até 15 dígitos permitidos.'
            )
        ],
        verbose_name='Telefone',
        help_text='Telefone de contato'
    )
    
    origem = models.CharField(
        max_length=20,
        choices=ORIGEM_CHOICES,
        default='site',
        verbose_name='Origem',
        help_text='Canal de origem do lead'
    )
    
    interesse = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name='Interesse',
        help_text='Produto ou serviço de interesse do lead'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='novo',
        verbose_name='Status',
        help_text='Status atual do lead no funil de vendas'
    )
    
    # Campos adicionais
    empresa = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name='Empresa',
        help_text='Nome da empresa do lead'
    )
    
    cargo = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='Cargo',
        help_text='Cargo do lead na empresa'
    )
    
    observacoes = models.TextField(
        blank=True,
        null=True,
        verbose_name='Observações',
        help_text='Observações e notas sobre o lead'
    )
    
    pontuacao = models.IntegerField(
        default=0,
        verbose_name='Pontuação',
        help_text='Score do lead para qualificação'
    )
    
    # Campos de data e controle
    data_cadastro = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Data de Cadastro'
    )
    
    data_atualizacao = models.DateTimeField(
        auto_now=True,
        verbose_name='Última Atualização'
    )
    
    data_ultimo_contato = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Último Contato',
        help_text='Data do último contato realizado com o lead'
    )
    
    class Meta:
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'
        ordering = ['-data_cadastro']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['status']),
            models.Index(fields=['origem']),
            models.Index(fields=['-data_cadastro']),
            models.Index(fields=['-pontuacao']),
        ]
    
    def __str__(self):
        return f"{self.nome} - {self.email} ({self.get_status_display()})"
