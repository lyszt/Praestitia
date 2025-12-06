import React, {useState, useEffect} from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { authenticatedFetch } from '../../../utils/api';

const DashboardStats = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesLength, setClientesLength] = useState(0);
  const [leads, setLeads] = useState([]);
  const [leadsLength, setLeadslength] = useState(0);

  useEffect(() => {
      (async () => {
        try {
          const response = await authenticatedFetch("/api/clientes/");
          if (response.ok) {
            const data = await response.json();
            if (data.clientes) {
              setClientes(data.clientes);
              setClientesLength(data.clientes.length);
            }
          } else {
            console.error("Falha ao buscar clientes: status", response.status);
          }
        } catch (error) {
          console.error("Erro ao buscar clientes:", error);
        }
      })();
    }, []);

  useEffect(() => {
      (async () => {
        try {
          const response = await authenticatedFetch("/api/leads/");
          if (response.ok) {
            const data = await response.json();
            if (data.leads) {
              setLeads(data.leads);
              setLeadslength(data.leads.length);
            }
          } else {
            console.error("Falha ao buscar leads: status", response.status);
          }
        } catch (error) {
          console.error("Erro ao buscar leads:", error);
        }
      })();
    }, []);

    const calcularPessoasCadastradas = () => {
      let countNew = 0;
      const currentDate = new Date();

      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

      clientes.forEach((cliente) => {
        const cadastroDate = new Date(cliente.data_cadastro);
        if(cadastroDate >= firstDayOfMonth && cadastroDate <= currentDate) {
          countNew++;
        }
      })

      leads.forEach((lead) => {
        const cadastroDate = new Date(lead.data_cadastro);
        if(cadastroDate >= firstDayOfMonth && cadastroDate <= currentDate) {
          countNew++;
        }
      })
      return countNew;
    }

  const stats = [
    {
      title: 'Total de Clientes',
      value: clientesLength,
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#10B981' }} />,
      color: '#10B981'
    },
    {
      title: 'Leads Ativos',
      value: leadsLength,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#10B981' }} />,
      color: '#10B981'
    },
    {
      title: 'Pessoas adicionadas no sistema este Mês',
      value: calcularPessoasCadastradas(),
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
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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
