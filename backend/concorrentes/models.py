from django.db import models
from django.conf import settings

class Concorrente(models.Model):
    """
    Modelo para gerenciar concorrentes.
    """
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='concorrentes')
    
    nome = models.CharField(
        max_length=200,
        verbose_name='Nome do Concorrente',
        help_text='Nome da empresa concorrente'
    )
    
    site = models.URLField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name='Site',
        help_text='Website do concorrente'
    )
    
    email = models.EmailField(
        max_length=254,
        blank=True,
        null=True,
        verbose_name='E-mail',
        help_text='E-mail de contato'
    )

    telefone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name='Telefone',
        help_text='Telefone de contato'
    )

    endereco = models.TextField(
        blank=True,
        null=True,
        verbose_name='Endereço',
        help_text='Endereço completo'
    )
    
    cidade = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='Cidade'
    )

    estado = models.CharField(
        max_length=2,
        blank=True,
        null=True,
        verbose_name='Estado'
    )

    cep = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        verbose_name='CEP'
    )

    cnpj = models.CharField(
        max_length=18,
        blank=True,
        null=True,
        verbose_name='CNPJ'
    )

    responsavel = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name='Responsável',
        help_text='Pessoa de contato ou responsável'
    )

    pontos_fortes = models.TextField(
        blank=True,
        null=True,
        verbose_name='Pontos Fortes'
    )

    pontos_fracos = models.TextField(
        blank=True,
        null=True,
        verbose_name='Pontos Fracos'
    )

    observacoes = models.TextField(
        blank=True,
        null=True,
        verbose_name='Observações',
        help_text='Análise e observações sobre o concorrente'
    )
    
    data_cadastro = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Concorrente'
        verbose_name_plural = 'Concorrentes'
        ordering = ['-data_cadastro']

    def __str__(self):
        return self.nome
