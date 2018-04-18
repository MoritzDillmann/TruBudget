const pt = {
  common: {
    cancel: 'Cancelar',
    next: 'Próximo',
    submit: 'Enviar',
    back: 'Voltar',
    finish: 'Finalizar',
    comment_description: 'Adicione comentário',
    budget: 'Orçamento',
    comment: 'Comentário',
    created: 'Criado',
    status: 'Status',
    actions: 'Ações',
    assigned: 'Atribuído',
    not_assigned: 'Não atribuído',
    not_assigned_budget: 'Orçamento não atribuído',
    disbursement: 'Projetado',
    assigned_budget: 'Atribuído',
    disbursed_budget: 'Desembolsado',
    budget_distribution: 'Distribuição do orçamento',
    task_status: 'Status da tarefa',
    subprojects: 'Subprojetos',
    subproject: 'Subprojeto',
    history: 'Histórico',
    close: 'Fechar',
    open: 'Abrir',
    in_progress: 'Em andamento',
    in_review: 'Em revisão',
    done: 'Finalizado',
    assignees: 'Responsável(is)',
    approver: 'Aprovador',
    bank: 'Banco',
    assignee: 'Responsável',
    completion: 'Conclusão',
    username: 'Usuário',
    password: 'Senha',
    incorrect_username: 'Usuário incorreto',
    incorrect_password: 'Senha incorreta',
    added: 'Adicionado'
  },

  adminDashboard: {
    role_name_error: "Nome do papel incorreto",
    role_organization_error: "Organização incorreta",
    roles: 'Papéis',
    role: 'Papel',
    new_role: 'Novo papel',
    users: 'Usuários',
    nodes: 'Nós',
    organization: 'Organização',
    id: 'ID',
    read: 'Leitura',
    write: 'Escrita',
    admin: 'Admin',
    name: 'Nome',
    full_name: 'Nome completo',
    incorrect_full_name: 'Nome completo incorreto',
    role_not_exist_error: 'Papel inexistente',
    new_user: 'Novo usuário',
    country: 'País',
    address: 'Endereço',
    admin_login: 'Admin Login',
    title: 'Admin Dashboard',
    user_not_authorized: 'Você não está autorizado a executar esta ação'
  },

  login: {
    tru_budget_description: 'Uma solução baseada em blockchain para monitoramento de despesas orçamentárias',
    environment: 'Ambiente',
    test_env: 'Teste',
    production_env: 'Produção',
    accenture_tag: 'Developed by Emerging Technologies & Innovation @ Accenture',
    login_button_title: 'Login',
    loading: 'Carregando ...'

  },
  project: {
    add_new_project: 'Criar novo projeto',
    project_details: 'Detalhes',
    project_name: 'Nome',
    project_budget: 'Orçamento',
    project_comment: 'Comentário',
    project_roles: '´Papéis',
    project_thumbnail: 'Miniatura',
    project_title: 'Nome do projeto',
    project_title_description: 'Descrição do projeto',
    project_budget_amount: 'Valor do orçamento do projeto',
    project_budget_amount_description: 'Descrição do orçamento do projeto',
    project_currency: 'Moeda',
    project_budget_authority_role: 'Selecione o papel da autoridade orçamentária',
    project_budget_authority_role_description: 'A autoridade competente para modificar o valor de orçamento do projeto',
    project_implementing_authority_role: 'Selecione o papel das autoridades implementadoras',
    project_implementing_authority_role_description: 'As autoridades competentes para criar e modificar subprojetos e definir e executar os fluxos de trabalho',
    project_disbursement_authority_role: 'Selecione o papel da autoridade de desembolso',
    project_disbursement_authority_role_description: 'As autoridades competentes para aprovar as transações financeiras',
    project_authority_organization_search: 'Pesquisar organizações',
    project_authority_role_search: 'Pesquisar papéis',

  },
  subproject: {
    subproject_title: 'Nome do subprojeto',
    subproject_title_description: 'Descrição do subprojeto',
    subproject_budget_amount: 'Valor do orçamento do subprojeto',
    subproject_budget_amount_description: 'Descrição do orçamento para o subprojeto',
    subproject_comment: 'Comentário do subprojeto',
    subproject_currency: 'Moeda do subprojeto',
    subproject_assigned_organization: 'Organização responsável',
    subproject_add: 'Criar novo subprojeto',
    subproject_select_button: 'Selecionar',
    subproject_completion_string: '{0} de {1} finalizado'

  },
  workflow: {
    non_approval: 'Aprovação desnecessária',
    approval_required: 'Aprovação necessária',
    edit_item: 'Editar workflow',
    add_item: 'Criar workflow',
    workflow_title: 'Nome do workflow',
    workflow_title_description: 'Descrição do workflow',
    workflow_budget_amount: 'Valor do orçamento do workflow',
    workflow_budget_amount_description: 'Descrição do orçamento do workflow',
    workflow_comment: 'Comentário do workflow',
    workflow_type_workflow: 'Workflow',
    workflow_type_transaction: 'Transação',
    workflow_action_open_in_progress: 'Aguardando ação de ',
    workflow_action_in_review: 'Aguardando revisão de ',
    workflow_action_pending_approval: 'Aguardando aprovação de ',
    workflow_budget_status_na: 'N/A',
    workflow_budget_status_allocated: 'Atribuído',
    workflow_budget_status_disbursed: 'Desembolsado',
    workflow_next_step: 'Próxima etapa',
    workflow_no_actions: 'Nenhuma ação necessária',
    workflow_none: 'Nenhum',
    workflow_enable_sort: 'Ordenar',
    worfkfow_disable_sort: 'Salvar',
    workflow_table_title: 'Lista de workflows',
    workflow_type: 'Categoria',
    workflow_documents: 'Documentos',
    workflow_name: 'Nome',
    workflow_document_name: 'Nome do documento',
    workflow_document_description: 'Digite um nome para o documento',
    workflow_no_documents: 'Não há documentos',
    workflow_document_validate: 'Validar',
    workflow_document_validated: 'Validado',
    workflow_document_changed: 'Alterado',
    workflow_upload_document: 'Autenticar',
    workflow_budget_na: 'Não se aplica',
    workflow_budget_allocated: 'alocado',
    workflow_budget_disbursed: 'desembolsado',
    workflow_budget: 'Valor do orçamento do workflow',
    workflow_budget_description: 'Orçamento para o workflow',
    workflow_submit_for_review: 'Enviar para revisão'
  },

  navigation: {
    unread_notifications: 'Notificações não lidas',
    peers: 'Nós',
    connected_peers: 'Nós conectados',
    no_peers: 'Desconectado',
    logout: 'Logout',
    read_permission: 'Leitura',
    write_permission: 'Escrita',
    admin_permission: 'Admin',
    selections: 'Seleções',
    options: 'Opções',
    rtUpdates: 'Atualizações em tempo real',
    other_trustees: 'Outros administradores',
    menu_item_projects: 'Projetos',
    menu_item_notifications: 'Notificações',
    menu_item_network: 'Rede',
    main_site: 'Principal',
    projects_site: 'Projetos'
  },
  dashboard: {
    dashboard_title: 'Painel da rede blockchain',
    dashboard_subtitle: 'Nós conectados na rede blockchain',
    dashboard_card_text: ' Os nós conectados na blockchain são mostrados no mapa abaixo. Para obter a localização exata, clique nos respectivos marcadores.'
  },
  notification: {
    notification_title: 'Notificações',
    notification_subtitle: 'Não lidas',
    notification_card_text: 'Por favor, verifique suas notificações abaixo. Elas contêm informações ou ações a serem tratadas.',
    notification_table_project: 'Projetos',
    notification_table_subproject: 'Subprojetos',
    notification_table_description: 'Descrição',
    notification_table_by: 'Por',
    notification_table_role: 'Papel',
    notification_table_all_read: 'Tudo lido',
    notification_table_view: 'Ler',
    create_workflow: 'Workflow {0} criado ',
    edit_workflow: 'Workflow {0} foi adaptado ',
    create_transaction: 'Transação {0} criada ',
    edit_transaction: 'Transação {0} foi adaptada ',
    review_workflow: 'Você foi solicitado a revisar o workflow {0}',
    review_transaction: 'Você foi solicitado a revisar a transação {0}',
    done_workflow: 'Status do workflow {0} alterado para Finalizado',
    done_transaction: 'Status da transação {0} alterado para Finalizado'
  },

  history: {
    edit_status: 'Status do workflow {0} mudou para {1}',
    edit_currency: 'Moeda do workflow {0} mudou para {1} ',
    edit_amount: 'Valor do workflow {0} mudou de {1} para {2} ',
    edit_comment: 'Comentário do workflow {0} mudou para {1} ',
    edit_addData: 'Dados adicionais do workflow {0} mudou para {1} ',
    edit_workflowName: 'Nome do workflow {0} mudou para {1} ',
    created_workflow: 'Workflow {0} criado ',
    created_project: 'Projeto criado ',
    created_subproject: 'Subprojeto {0} criado',
    edit_amountType: 'Status orçamentário do workflow {0} mudou de {1} para {2}',
    edit_documents: 'Documentos alterados para workflow {0}',
    edit_subproject: 'Valor de {0} subiu para {1}',
    first_sort: '{0} foi movido para a primeira posição',
    sort: '{0} foi movido após {1}'
  },
  language: {
    german: 'German',
    french: 'Français',
    english: 'English',
	portuguese: 'Português',
  },
}
export default pt;