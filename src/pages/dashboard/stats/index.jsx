import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const DashboardStats = () => {
  // Dados fictícios - você pode conectar com API depois
  const stats = [
    {
      title: 'Total de Clientes',
      value: '150',
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#10B981' }} />,
      color: '#10B981'
    },
    {
      title: 'Leads Ativos',
      value: '45',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#10B981' }} />,
      color: '#10B981'
    },
    {
      title: 'Taxa de Conversão',
      value: '32%',
      icon: <AttachMoneyIcon sx={{ fontSize: 40, color: '#10B981' }} />,
      color: '#10B981'
    },
    {
      title: 'Novos este Mês',
      value: '12',
      icon: <DashboardIcon sx={{ fontSize: 40, color: '#10B981' }} />,
      color: '#10B981'
    }
  ];

  return (
    <main className="p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <DashboardIcon sx={{ fontSize: 40, color: '#10B981' }} />
          Dashboard de Estatísticas
        </h1>
        <p className="mt-2" style={{ color: 'var(--muted)' }}>Visão geral do seu negócio</p>
      </header>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                backgroundColor: 'var(--surface-2)',
                borderColor: 'var(--surface-3)',
                border: '1px solid',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  backgroundColor: 'var(--surface-3)'
                }
              }}
            >
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  {stat.icon}
                </div>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#10B981' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'var(--muted)' }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div className="mt-8">
        <Card sx={{
          backgroundColor: 'var(--surface-2)',
          borderColor: 'var(--surface-3)',
          border: '1px solid'
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'var(--praestitia-text)' }}>
              Bem-vindo ao Praestitia
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--muted)' }}>
              Utilize o menu lateral para navegar entre as diferentes seções do sistema.
              Aqui você pode gerenciar seus clientes e leads de forma eficiente.
            </Typography>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default DashboardStats;
