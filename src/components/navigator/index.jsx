import "./Navigator.css";

const Navigator = ({ children, currentPage, onNavigate }) => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="abrir barra lateral"
            className="btn btn-square btn-ghost"
          >
            {/* Ícone do menu */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4">Praestitia</div>
        </nav>
        {/* Conteúdo interno da página, isso é meio fractal */}
        <div className="p-4">
          {children}
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="fechar barra lateral"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">


          {/* Menu lateral */}
          <ul className="menu w-full grow">
            {/* Clientes */}
            <li>
              <button
                className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${currentPage === 'cliente' ? 'active' : ''}`}
                data-tip="Clientes"
                onClick={() => onNavigate('cliente')}
              >
                {/* Ícone de pessoas/usuários */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                >
                  <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                  <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                </svg>
                <span className="is-drawer-close:hidden">Clientes</span>
              </button>
            </li>

            {/* Leads */}
            <li>
              <button
                className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${currentPage === 'lead' ? 'active' : ''}`}
                data-tip="Leads"
                onClick={() => onNavigate('lead')}
              >
                {/* Ícone de alvo/target */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                >
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="12" r="5"></circle>
                  <circle cx="12" cy="12" r="9"></circle>
                </svg>
                <span className="is-drawer-close:hidden">Leads</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navigator;
