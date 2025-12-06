from django.db import models
from django.core.validators import EmailValidator, RegexValidator

# Create your models here.

class Cliente(models.Model):
    """
    Modelo para gerenciar clientes cadastrados no sistema.
    Representa clientes que já converteram de leads ou foram cadastrados diretamente.
    """
    
    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('inativo', 'Inativo'),
        ('pendente', 'Pendente'),
        ('suspenso', 'Suspenso'),
    ]
    
    # Campos básicos
    nome = models.CharField(
        max_length=200,
        verbose_name='Nome do Cliente',
        help_text='Nome completo ou razão social do cliente'
    )
    
    email = models.EmailField(
        max_length=254,
        unique=True,
        validators=[EmailValidator()],
        verbose_name='E-mail',
        help_text='E-mail de contato do cliente'
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
    
    empresa = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name='Empresa',
        help_text='Nome da empresa do cliente'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ativo',
        verbose_name='Status',
        help_text='Status atual do cliente'
    )
    
    # Campos adicionais
    endereco = models.TextField(
        blank=True,
        null=True,
        verbose_name='Endereço',
        help_text='Endereço completo do cliente'
    )
    
    cnpj_cpf = models.CharField(
        max_length=18,
        blank=True,
        null=True,
        verbose_name='CNPJ/CPF',
        help_text='CNPJ ou CPF do cliente'
    )
    
    observacoes = models.TextField(
        blank=True,
        null=True,
        verbose_name='Observações',
        help_text='Observações e notas sobre o cliente'
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
    
    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'
        ordering = ['-data_cadastro']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['status']),
            models.Index(fields=['-data_cadastro']),
        ]
    
    def __str__(self):
        return f"{self.nome} - {self.email}"
