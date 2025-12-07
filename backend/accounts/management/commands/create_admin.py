from django.core.management.base import BaseCommand
from accounts.models import User, Group


class Command(BaseCommand):
    help = 'Cria um usuário administrador padrão'

    def handle(self, *args, **kwargs):
        admin_group, created = Group.objects.get_or_create(
            name='admin',
            defaults={'permissions': [1]}
        )

        if created:
            self.stdout.write('Grupo admin criado')
        else:
            if 1 not in admin_group.permissions:
                admin_group.permissions.append(1)
                admin_group.save()
            self.stdout.write('Grupo admin já existe')

        if User.objects.filter(username='admin').exists():
            self.stdout.write('Usuário admin já existe')
            admin_user = User.objects.get(username='admin')
            if admin_user.group != admin_group:
                admin_user.group = admin_group
                admin_user.save()
                self.stdout.write('Usuário admin atualizado')
        else:
            admin_user = User.objects.create_user(
                username='admin',
                email='admin@praestitia.com',
                password='admin123',
                group=admin_group
            )
            self.stdout.write('Usuário admin criado')

        self.stdout.write('\nCredenciais de Admin:')
        self.stdout.write('Username: admin')
        self.stdout.write('Password: admin123')
        self.stdout.write('Email: admin@praestitia.com')
