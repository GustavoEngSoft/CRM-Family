import React, { useState, useEffect } from 'react';
import MenuLateral from '../menuLateral/menuLateral';
import { AcompanhamentoAPI, PessoasAPI } from '../../services/api';
import './acompanhamento.css';

function Acompanhamento() {
	const [columns, setColumns] = useState({
		pendente: { title: 'A fazer', items: [] },
		em_andamento: { title: 'Em andamento', items: [] },
		concluido: { title: 'Concluído', items: [] }
	});
	const [draggedItem, setDraggedItem] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);
	const [viewingTask, setViewingTask] = useState(null);
	const [editingTask, setEditingTask] = useState(null);
	const [openMenuId, setOpenMenuId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [pessoas, setPessoas] = useState([]);
	const [nearDeadlineTasks, setNearDeadlineTasks] = useState([]);
	const [showNotifications, setShowNotifications] = useState(true);
	const [newTask, setNewTask] = useState({
		titulo: '',
		descricao: '',
		pessoa_id: '',
		data_prevista: '',
		prioridade: 'media',
		tipo: 'geral',
		status: 'pendente'
	});

	const prioridades = [
		{ value: 'baixa', label: 'Baixa' },
		{ value: 'media', label: 'Média' },
		{ value: 'alta', label: 'Alta' }
	];

	const tipos = [
		{ value: 'geral', label: 'Geral', icon: '📋' },
		{ value: 'visita', label: 'Visita', icon: '🏠' },
		{ value: 'reuniao', label: 'Reunião', icon: '👥' },
		{ value: 'contato', label: 'Contato', icon: '📞' },
		{ value: 'acompanhamento', label: 'Acompanhamento', icon: '📊' }
	];

	useEffect(() => {
		loadData();
		requestNotificationPermission();
	}, []);

	const requestNotificationPermission = async () => {
		if ('Notification' in window && Notification.permission === 'default') {
			await Notification.requestPermission();
		}
	};

	const checkNearDeadlines = (acompanhamentos) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		
		const near = acompanhamentos.filter(item => {
			if (!item.data_prevista || item.status === 'concluido') return false;
			
			const dataTask = new Date(item.data_prevista);
			dataTask.setHours(0, 0, 0, 0);
			
			const diffTime = dataTask - today;
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			
			return diffDays >= 0 && diffDays <= 3; // Próximos 3 dias
		});
		
		setNearDeadlineTasks(near);
		
		// Notificação do navegador
		if (near.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
			new Notification('⚠️ Tarefas Próximas do Vencimento', {
				body: `Você tem ${near.length} tarefa(s) com vencimento nos próximos 3 dias.`,
				icon: '/logoIgreja.png'
			});
		}
	};

	const loadData = async () => {
		try {
			setLoading(true);
			const [acompanhamentos, pessoasData] = await Promise.all([
				AcompanhamentoAPI.list(1, 1000),
				PessoasAPI.list(1, 1000)
			]);

			setPessoas(pessoasData.data || []);
			organizeIntoColumns(acompanhamentos.data || []);
		} catch (err) {
			console.error('Erro ao carregar dados:', err);
			alert('Erro ao carregar dados: ' + err.message);
		} finally {
			setLoading(false);
		}
	};

	const organizeIntoColumns = (acompanhamentos) => {
		const organized = {
			pendente: { title: 'A fazer', items: [] },
			em_andamento: { title: 'Em andamento', items: [] },
			concluido: { title: 'Concluído', items: [] }
		};

		acompanhamentos.forEach(item => {
			const status = item.status || 'pendente';
			if (organized[status]) {
				organized[status].items.push(item);
			}
		});

		setColumns(organized);
		checkNearDeadlines(acompanhamentos);
	};

	const handleDragStart = (item, fromColumn) => {
		setDraggedItem({ item, fromColumn });
	};

	const handleDrop = async (toColumn) => {
		if (!draggedItem) return;
		const { item, fromColumn } = draggedItem;
		if (fromColumn === toColumn) return;

		try {
			// Atualizar no banco de dados
			await AcompanhamentoAPI.update(item.id, { status: toColumn });

			// Atualizar estado local
			setColumns((prev) => {
				const sourceItems = prev[fromColumn].items.filter((i) => i.id !== item.id);
				const targetItems = [...prev[toColumn].items, { ...item, status: toColumn }];

				return {
					...prev,
					[fromColumn]: {
						...prev[fromColumn],
						items: sourceItems
					},
					[toColumn]: {
						...prev[toColumn],
						items: targetItems
					}
				};
			});
		} catch (err) {
			console.error('Erro ao atualizar status:', err);
			alert('Erro ao atualizar status: ' + err.message);
		}

		setDraggedItem(null);
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const filteredItems = (items) =>
		items.filter((item) =>
			item.titulo.toLowerCase().includes(searchTerm.toLowerCase())
		);

	const handleAddTask = async () => {
		if (!newTask.titulo.trim()) {
			alert('Por favor, preencha o título da tarefa');
			return;
		}

		try {
			setSaving(true);

			if (editingTask) {
				// Editando tarefa existente
				await AcompanhamentoAPI.update(editingTask.id, newTask);
			} else {
				// Adicionando nova tarefa
				await AcompanhamentoAPI.create(newTask);
			}

			await loadData(); // Recarregar dados
			handleModalClose();
		} catch (err) {
			console.error('Erro ao salvar tarefa:', err);
			alert('Erro ao salvar tarefa: ' + err.message);
		} finally {
			setSaving(false);
		}
	};

	const handleModalClose = () => {
		setShowModal(false);
		setEditingTask(null);
		setNewTask({
			titulo: '',
			descricao: '',
			pessoa_id: '',
			data_prevista: '',
			prioridade: 'media',
			tipo: 'geral',
			status: 'pendente'
		});
	};

	const handleViewTask = (item) => {
		setViewingTask(item);
		setShowViewModal(true);
	};

	const handleCloseViewModal = () => {
		setShowViewModal(false);
		setViewingTask(null);
	};

	const handleEditTask = (item, columnId) => {
		setEditingTask(item);
		setNewTask({
			titulo: item.titulo,
			descricao: item.descricao || '',
			pessoa_id: item.pessoa_id || '',
			data_prevista: item.data_prevista ? item.data_prevista.split('T')[0] : '',
			prioridade: item.prioridade || 'media',
			tipo: item.tipo || 'geral',
			status: item.status || columnId
		});
		setShowModal(true);
		setOpenMenuId(null);
	};

	const handleDeleteTask = async (itemId) => {
		if (!window.confirm('Deseja realmente excluir esta tarefa?')) return;
		
		try {
			await AcompanhamentoAPI.delete(itemId);
			await loadData(); // Recarregar dados
		} catch (err) {
			console.error('Erro ao excluir tarefa:', err);
			alert('Erro ao excluir tarefa: ' + err.message);
		}
		
		setOpenMenuId(null);
	};

	const getPessoaNome = (pessoaId) => {
		const pessoa = pessoas.find(p => p.id === pessoaId);
		return pessoa ? pessoa.nome : 'Não atribuído';
	};

	const getTipoInfo = (tipo) => {
		const tipoObj = tipos.find(t => t.value === tipo);
		return tipoObj || { icon: '📋', label: 'Geral' };
	};

	const getPrioridadeColor = (prioridade) => {
		const colors = {
			baixa: '#4caf50',
			media: '#ff9800',
			alta: '#f44336'
		};
		return colors[prioridade] || colors.media;
	};

	const isNearDeadline = (dataTask) => {
		if (!dataTask) return false;
		
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		
		const data = new Date(dataTask);
		data.setHours(0, 0, 0, 0);
		
		const diffTime = data - today;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		
		return diffDays >= 0 && diffDays <= 3;
	};

	const getDaysUntilDeadline = (dataTask) => {
		if (!dataTask) return null;
		
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		
		const data = new Date(dataTask);
		data.setHours(0, 0, 0, 0);
		
		const diffTime = data - today;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		
		return diffDays;
	};

	const toggleMenu = (itemId) => {
		setOpenMenuId(openMenuId === itemId ? null : itemId);
	};

	return (
		<div className="acompanhamento-container">
			<MenuLateral />
			<div className="acompanhamento-content">
				<header className="acompanhamento-header">
					<h1 className="acompanhamento-title">Acompanhamento</h1>
					<div className="acompanhamento-actions">
						<div className="acompanhamento-search">
							<input
								type="text"
								placeholder="Buscar..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<span className="search-icon">🔍</span>
						</div>
						<button className="acompanhamento-add" onClick={() => setShowModal(true)}>Adicionar +</button>
					</div>
				</header>

				{nearDeadlineTasks.length > 0 && showNotifications && (
					<div className="deadline-notifications">
						<div className="notification-header">
							<div className="notification-title">
								<span className="alert-icon">⚠️</span>
								<span>Tarefas Próximas do Vencimento ({nearDeadlineTasks.length})</span>
							</div>
							<button 
								className="notification-close"
								onClick={() => setShowNotifications(false)}
							>
								×
							</button>
						</div>
						<div className="notification-list">
							{nearDeadlineTasks.map(task => {
								const days = getDaysUntilDeadline(task.data_prevista);
								return (
									<div key={task.id} className="notification-item">
										<span className="notification-task-title">{task.titulo}</span>
										<span className="notification-task-days">
											{days === 0 ? 'Hoje' : days === 1 ? 'Amanhã' : `${days} dias`}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{loading ? (
					<div className="loading-message">Carregando acompanhamentos...</div>
				) : (
					<div className="kanban-board">
						{Object.entries(columns).map(([columnId, column]) => (
							<div
								key={columnId}
								className="kanban-column"
								onDragOver={handleDragOver}
								onDrop={() => handleDrop(columnId)}
							>
								<div className="kanban-column-header">
									<h2>{column.title}</h2>
									<span className="kanban-count">{column.items.length}</span>
								</div>
								<div className="kanban-items">
									{filteredItems(column.items).map((item) => (
										<div
											key={item.id}
											className="kanban-card"
											draggable
											onDragStart={() => handleDragStart(item, columnId)}
										>
											<div className="kanban-card-actions">
												<button 
													className="kanban-card-view"
													onClick={() => handleViewTask(item)}
													title="Ver detalhes"
												>
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
														<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
													</svg>
												</button>
												<div className="kanban-card-menu">
													<button 
														className="kanban-card-menu-btn"
														onClick={(e) => {
															e.stopPropagation();
															toggleMenu(item.id);
														}}
														title="Mais opções"
													>
														⋮
													</button>
													{openMenuId === item.id && (
														<div className="kanban-menu-dropdown">
															<button 
																onClick={() => handleEditTask(item, columnId)}
																className="menu-option"
															>
																✏️ Editar
															</button>
															<button 
																onClick={() => handleDeleteTask(item.id)}
																className="menu-option delete"
															>
																🗑️ Excluir
															</button>
														</div>
													)}
												</div>
											</div>
											<div className="kanban-card-title">{item.titulo}</div>
											{item.tipo && (
												<div className="kanban-card-type">
													{getTipoInfo(item.tipo).icon} {getTipoInfo(item.tipo).label}
												</div>
											)}
											{item.prioridade && (
												<div 
													className="kanban-card-priority"
													style={{ backgroundColor: getPrioridadeColor(item.prioridade) }}
												>
													{item.prioridade.charAt(0).toUpperCase() + item.prioridade.slice(1)}
												</div>
											)}
											{item.data_prevista && (
											<div className={`kanban-card-date ${isNearDeadline(item.data_prevista) && item.status !== 'concluido' ? 'near-deadline' : ''}`}>
												{isNearDeadline(item.data_prevista) && item.status !== 'concluido' && (
													<span className="deadline-warning">⚠️</span>
												)}
												📅 {new Date(item.data_prevista).toLocaleDateString('pt-BR')}
												{isNearDeadline(item.data_prevista) && item.status !== 'concluido' && (
													<span className="deadline-label">
														{(() => {
															const days = getDaysUntilDeadline(item.data_prevista);
															return days === 0 ? '(Hoje!)' : days === 1 ? '(Amanhã!)' : `(${days} dias)`;
														})()}
													</span>
												)}
												</div>
											)}
											{item.pessoa_id && (
												<div className="kanban-card-responsible">
													👤 {getPessoaNome(item.pessoa_id)}
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{showModal && (
				<div className="modal-overlay-acomp" onClick={handleModalClose}>
					<div className="modal-content-acomp" onClick={(e) => e.stopPropagation()}>
						<h2 className="modal-title-acomp">{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>

						<div className="form-group-acomp">
							<label className="form-label-acomp">Título da tarefa *</label>
							<input
								type="text"
								placeholder="Digite o título..."
								value={newTask.titulo}
								onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
								className="form-input-acomp"
							/>
						</div>

						<div className="form-group-acomp">
							<label className="form-label-acomp">Descrição</label>
							<textarea
								placeholder="Digite a descrição..."
								value={newTask.descricao}
								onChange={(e) => setNewTask({ ...newTask, descricao: e.target.value })}
								className="form-textarea-acomp"
								rows="3"
							/>
						</div>

						<div className="form-group-acomp">
							<label className="form-label-acomp">Pessoa</label>
							<select
								value={newTask.pessoa_id}
								onChange={(e) => setNewTask({ ...newTask, pessoa_id: e.target.value })}
								className="form-select-acomp"
							>
								<option value="">Selecione uma pessoa</option>
								{pessoas.map((pessoa) => (
									<option key={pessoa.id} value={pessoa.id}>
										{pessoa.nome}
									</option>
								))}
							</select>
						</div>

						<div className="form-group-acomp">
							<label className="form-label-acomp">Tipo de Tarefa</label>
							<select
								value={newTask.tipo}
								onChange={(e) => setNewTask({ ...newTask, tipo: e.target.value })}
								className="form-select-acomp"
							>
								{tipos.map((t) => (
									<option key={t.value} value={t.value}>
										{t.icon} {t.label}
									</option>
								))}
							</select>
						</div>

						<div className="form-group-acomp">
							<label className="form-label-acomp">Prioridade</label>
							<select
								value={newTask.prioridade}
								onChange={(e) => setNewTask({ ...newTask, prioridade: e.target.value })}
								className="form-select-acomp"
							>
								{prioridades.map((p) => (
									<option key={p.value} value={p.value}>
										{p.label}
									</option>
								))}
							</select>
						</div>

						<div className="form-group-acomp">
							<label className="form-label-acomp">Data Prevista</label>
							<input
								type="date"
								value={newTask.data_prevista}
								onChange={(e) => setNewTask({ ...newTask, data_prevista: e.target.value })}
								className="form-input-acomp"
							/>
						</div>

						{!editingTask && (
							<div className="form-group-acomp">
								<label className="form-label-acomp">Status</label>
								<select
									value={newTask.status}
									onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
									className="form-select-acomp"
								>
									<option value="pendente">A fazer</option>
									<option value="em_andamento">Em andamento</option>
									<option value="concluido">Concluído</option>
								</select>
							</div>
						)}

						<div className="modal-buttons-acomp">
							<button 
								className="btn-salvar-acomp" 
								onClick={handleAddTask}
								disabled={saving}
							>
								{saving ? 'Salvando...' : (editingTask ? 'Salvar' : 'Adicionar')}
							</button>
							<button className="btn-fechar-acomp" onClick={handleModalClose}>
								Cancelar
							</button>
						</div>
					</div>
				</div>
			)}

			{showViewModal && viewingTask && (
				<div className="modal-overlay-acomp" onClick={handleCloseViewModal}>
					<div className="modal-content-acomp modal-view" onClick={(e) => e.stopPropagation()}>
						<h2 className="modal-title-acomp">Detalhes da Tarefa</h2>

						<div className="view-group">
							<label className="view-label">Título</label>
							<p className="view-text">{viewingTask.titulo}</p>
						</div>

						{viewingTask.descricao && (
							<div className="view-group">
								<label className="view-label">Descrição</label>
								<p className="view-text">{viewingTask.descricao}</p>
							</div>
						)}

						{viewingTask.pessoa_id && (
							<div className="view-group">
								<label className="view-label">Pessoa</label>
								<p className="view-text">👤 {getPessoaNome(viewingTask.pessoa_id)}</p>
							</div>
						)}

						{viewingTask.tipo && (
							<div className="view-group">
								<label className="view-label">Tipo de Tarefa</label>
								<p className="view-text">{getTipoInfo(viewingTask.tipo).icon} {getTipoInfo(viewingTask.tipo).label}</p>
							</div>
						)}

						{viewingTask.prioridade && (
							<div className="view-group">
								<label className="view-label">Prioridade</label>
								<p className="view-text" style={{ 
									display: 'inline-block',
									padding: '4px 12px',
									borderRadius: '4px',
									backgroundColor: getPrioridadeColor(viewingTask.prioridade),
									color: 'white',
									fontWeight: 'bold'
								}}>
									{viewingTask.prioridade.charAt(0).toUpperCase() + viewingTask.prioridade.slice(1)}
								</p>
							</div>
						)}

						{viewingTask.data_prevista && (
							<div className="view-group">
								<label className="view-label">Data Prevista</label>
								<p className="view-text">📅 {new Date(viewingTask.data_prevista).toLocaleDateString('pt-BR')}</p>
							</div>
						)}

						{viewingTask.data_conclusao && (
							<div className="view-group">
								<label className="view-label">Data de Conclusão</label>
								<p className="view-text">✅ {new Date(viewingTask.data_conclusao).toLocaleDateString('pt-BR')}</p>
							</div>
						)}

						<div className="modal-buttons-acomp">
							<button className="btn-fechar-acomp" onClick={handleCloseViewModal}>
								Fechar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Acompanhamento;
